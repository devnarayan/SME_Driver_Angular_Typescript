
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.Configuration;
using SME.TMS.API.Repo;
using SME.TMS.API.Interface;
using SME.TMS.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Net;
using SME.TMS.API.Interface.Requests;
using SME.TMS.API.Interface.Responses;

namespace SME.TMS.API.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    [EnableCors("CorsPolicyAllowAll")]
    public class MaintenanceController : Controller
    {
        private readonly IConfiguration config;
        private readonly IDriverRepository repository;

        public MaintenanceController(IDriverRepository repository, IConfiguration config)
        {
            this.repository = repository;
            this.config = config;
        }

        [HttpPost]
        [ActionName("GetPeriodLookups")]
        public async Task<IActionResult> GetPeriodLookups([FromBody]GetPeriodLookupsRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            GetPeriodLookupsResponse resp = new GetPeriodLookupsResponse();

            resp.FrequencyTypes = await repository.GetAllFrequencyTypes();

            return Ok(resp);
        }

        [HttpPost]
        [ActionName("GetPeriodList")]
        public async Task<IActionResult> GetPeriodList([FromBody]GetPeriodListRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            GetPeriodListResponse resp = new GetPeriodListResponse();

            resp.Periods = (await repository.GetPeriodsByCompanyId(user.CompanyId)).ConvertAll(x => LoadPeriod(x));

            resp.Periods = resp.Periods.OrderByDescending(x => x.StartDate).ToList();

            return Ok(resp);
        }

        [HttpPost]
        [ActionName("SavePeriodList")]
        public async Task<IActionResult> SavePeriodList([FromBody]SavePeriodListRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            if (req.Periods == null)
                req.Periods = (await repository.GetPeriodsByCompanyId(user.CompanyId)).Select(x => LoadPeriod(x)).ToList();

            try
            {
                if (req.IsBuild)
                    req.Periods.AddRange(BuildPeriodList(req.FrequencyTypeId, req.StartDate, req.EndDate));
            }catch(ArgumentException e)
            {
                return NotFound(e);
            }

            GetPeriodListResponse resp = new GetPeriodListResponse();
            resp.Periods = new List<PeriodModel>(req.Periods.Count + 10);

            using (var transaction = await repository.StartTransaction())
            {
                try
                {
                    foreach (PeriodModel period in req.Periods)
                    {
                        try
                        {
                            if (!period.IsDeleted)
                            {
                                var result = await SavePeriodModel(user, period);

                                resp.Periods.Add(result);
                            }
                            else
                            {
                                Period existingPeriod = await repository.GetPeriodById(period.PeriodId);

                                if (existingPeriod == null)
                                    throw new NullReferenceException("Could not find the period with the id specified.");

                                repository.Delete(existingPeriod);
                                await repository.SaveChanges();
                            }
                        }
                        catch (NullReferenceException e)
                        {
                            throw new NullReferenceException($"Period: {period.PeriodId} error", e);
                        }
                        catch (UnauthorizedAccessException e)
                        {
                            throw new UnauthorizedAccessException($"Period: {period.PeriodId} is not editable by this user.", e);
                        }
                        catch (Exception e)
                        {
                            throw new Exception("Unknown Error Occured.", e);
                        }
                    }

                    transaction.Commit();
                }catch(Exception e)
                {
                    transaction.Rollback();

                    return NotFound(e.InnerException);
                }

                resp.Periods = resp.Periods.OrderByDescending(x => x.StartDate).ToList();

                return Ok(resp);
            }
        }

        [HttpPost]
        [ActionName("GetExpenseTypeList")]
        public async Task<IActionResult>  GetExpenseTypeList([FromBody]GetExpenseTypeListRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            GetExpenseTypeListResponse resp = new GetExpenseTypeListResponse()
            {
                ExpenseTypes = (await repository.GetAllExpenseTypes()).Select(x => LoadExpenseType(x)).ToList()
            };

            return Ok(resp);
        }

        [HttpPost]
        [ActionName("SaveExpenseTypeList")]
        public async Task<IActionResult> SaveExpenseTypeList([FromBody]SaveExpenseTypeListRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            GetExpenseTypeListResponse resp = new GetExpenseTypeListResponse();
            resp.ExpenseTypes = new List<ExpenseTypeModel>();

            using (var transaction = await repository.StartTransaction())
            {
                try
                {
                    foreach(var model in req.ExpenseTypes)
                        resp.ExpenseTypes.Add(await SaveExpenseType(user, model, repository));

                    transaction.Commit();
                }
                catch(Exception e)
                {
                    transaction.Rollback();
                    return NotFound(e);
                }
            }

            return Ok(resp);
        }

        #region Utility

        /// <summary>
        /// Attempts to save a new or existing Period based n the model provided.
        /// </summary>
        /// <param name="currentUser">The user attempting to save.</param>
        /// <param name="period">The model of data trying to be saved.</param>
        /// <exception cref="NullReferenceException">This will be thrown when a period that doesnt seem to be new doesnt exist in the db.</exception>
        /// <exception cref="UnauthorizedAccessException">This will be thrown when a user attempts to save a period they dont have access to.</exception>"
        /// <exception cref="ArgumentException">This will be thrown when the period overlaps an existing period.</exception>
        /// <returns>A period DTO that represents what was saved.</returns>
        private async Task<PeriodModel> SavePeriodModel(PortalUser currentUser, PeriodModel period)
        {
            var existingPeriod = await repository.GetPeriodById(period.PeriodId);

            if (existingPeriod == null && period.PeriodId > 0)
                throw new NullReferenceException("Could not find period with id specified.");
            else if (existingPeriod == null)
            {
                existingPeriod = new Period()
                {
                    CreatedBy = currentUser.PortalUsername,
                    CreatedDate = DateTime.UtcNow,
                    ModifiedBy = currentUser.PortalUsername,
                    ModifiedDate = DateTime.UtcNow
                };
            }
            else if (existingPeriod.CompanyId != currentUser.CompanyId)
                throw new UnauthorizedAccessException("You cannot acces this period as this user.");

            existingPeriod.Year = period.Year;
            existingPeriod.EndDate = period.EndDate;
            existingPeriod.StartDate = period.StartDate;
            existingPeriod.FrequencyTypeId = period.FrequencyTypeId;
            existingPeriod.CompanyId = currentUser.CompanyId;
            existingPeriod.IsActive = true;

            existingPeriod.FrequencyType = await repository.GetFrequencyTypeById(period.FrequencyTypeId);

            if (existingPeriod.PeriodId == 0)
            {
                // Need to check for non overlapping periods.
                if (await repository.IsPeriodOverlapping(existingPeriod.StartDate, existingPeriod.EndDate))
                    throw new ArgumentException("New period overlaps with a previous period.");

                repository.Insert(existingPeriod);
                await repository.SaveChanges();
            }
            else if (repository.IsChanged(existingPeriod)) 
            {
                existingPeriod.ModifiedBy = currentUser.PortalUsername;
                existingPeriod.ModifiedDate = DateTime.UtcNow;

                repository.Attach(existingPeriod);
                await repository.SaveChanges();
            }

            return LoadPeriod(existingPeriod);
        }


        /// <summary>
        /// Converts the database version of a period into a DTO version.
        /// </summary>
        /// <param name="period">The database version of a period</param>
        /// <returns>The DTO version of a period.</returns>
        public static PeriodModel LoadPeriod(Period period)
        {
            return new PeriodModel()
            {
                EndDate = period.EndDate,
                FrequencyTypeId = period.FrequencyTypeId,
                FrequencyTypeName = period.FrequencyType?.FrequencyName,
                PeriodId = period.PeriodId,
                StartDate = period.StartDate,
                Year = period.Year
            };
        }

        /// <summary>
        /// Builds a list of period models based on the frequency and the start and end dates.
        /// </summary>
        /// <param name="frequencyTypeId">The frequency type to determine the interval of the periods.</param>
        /// <param name="startDate">The month and year datetime at which the list should start creating periods.</param>
        /// <param name="endDate">The month and year that the list should stop creating periods.</param>
        /// <returns></returns>
        public List<PeriodModel> BuildPeriodList(int frequencyTypeId, DateTime startDate, DateTime endDate)
        {
            //Normalize parameters
            DateTime currDate = new DateTime(startDate.Year, startDate.Month, 1);
            DateTime normEndDate = new DateTime(endDate.Year, endDate.Month, DateTime.DaysInMonth(endDate.Year, endDate.Month));

            // Return List
            List<PeriodModel> ret = new List<PeriodModel>();

            while(currDate < normEndDate)
            {
                switch (frequencyTypeId) {
                    case (int)FrequencyType.Enum.BiMonthly:
                        if(currDate.Day < 16)
                        {
                            ret.Add(new PeriodModel()
                            {
                                StartDate = new DateTime(currDate.Year, currDate.Month, 1),
                                EndDate = new DateTime(currDate.Year, currDate.Month, 15),
                                FrequencyTypeId = (int)FrequencyType.Enum.BiMonthly,
                                Year = 0,
                                PeriodId = 0,
                                IsDeleted = false
                            });

                            currDate = new DateTime(currDate.Year, currDate.Month, 16);
                        }
                        else
                        {
                            ret.Add(new PeriodModel()
                            {
                                StartDate = new DateTime(currDate.Year, currDate.Month, 16),
                                EndDate = new DateTime(currDate.Year, currDate.Month, DateTime.DaysInMonth(currDate.Year, currDate.Month)),
                                FrequencyTypeId = (int)FrequencyType.Enum.BiMonthly,
                                Year = 0,
                                PeriodId = 0,
                                IsDeleted = false
                            });

                            currDate = new DateTime(currDate.Year, currDate.Month, 1).AddMonths(1);
                        }

                        break;
                    default:
                        throw new ArgumentException("Frequency Not Supported");
                }
            }

            return ret;
        }

        /// <summary>
        /// Loads a DTO version of expense type given the DB version of expense type
        /// </summary>
        /// <param name="expense">The DB model of an expense type.</param>
        /// <returns>The DTO version of an expense type.</returns>
        public static ExpenseTypeModel LoadExpenseType(ExpenseType expense)
        {
            return new ExpenseTypeModel()
            {
                AutomationCode = expense.AutomationCode,
                CompanyPercent = expense.CompanyPercent,
                DriverPercent = expense.DriverPercent,
                ExpenseTypeDesc = expense.ExpenseTypeDesc,
                ExpenseTypeID = expense.ExpenseTypeID,
                ExpenseTypeName = expense.ExpenseTypeName,
                FrequencyTypeId = expense.FrequencyTypeId,
                FrequencyTypeName = expense.FrequencyType.FrequencyName,
                CompanyGLAccount = expense.SMEGLAccount,
                DriverGLAccount = expense.DriverGLAccount
            };
        }

        public async static Task<ExpenseTypeModel> SaveExpenseType(PortalUser user, ExpenseTypeModel model, IDriverRepository repository)
        {
            ExpenseType dbEntry;

            // Existing or new Expense Type?
            if(model.ExpenseTypeID == 0)
            {
                // New Expense Type
                dbEntry = new ExpenseType()
                {
                    CreatedBy = user.PortalUsername,
                    CreatedDate = DateTime.UtcNow
                };

                repository.Insert(dbEntry);
            }
            else
            {
                // Requesting an existing Expense Type
                dbEntry = await repository.GetExpenceTypeById(model.ExpenseTypeID);
            }

            // Check for errors
            if (dbEntry == null)
                throw new NullReferenceException($"Could not find expense type: {model.ExpenseTypeName}");

            // Make sure that the frequency type is valid.
            FrequencyType frequency = await repository.GetFrequencyTypeById(model.FrequencyTypeId);
            if (frequency == null)
                throw new NullReferenceException($"Could not find the frequency type for expense: {model.ExpenseTypeName}.");

            //Transfer data.
            dbEntry.ExpenseTypeName = model.ExpenseTypeName;
            dbEntry.AutomationCode = model.AutomationCode;
            dbEntry.CompanyPercent = model.CompanyPercent;
            dbEntry.DriverPercent = model.DriverPercent;
            dbEntry.ExpenseTypeDesc = model.ExpenseTypeDesc;
            dbEntry.FrequencyTypeId = frequency.FrequencyTypeId;
            dbEntry.FrequencyType = frequency;
            dbEntry.DriverGLAccount = model.DriverGLAccount;
            dbEntry.SMEGLAccount = model.CompanyGLAccount;
            dbEntry.IsActive = true;

            // Check for changes.
            if (repository.IsChanged(dbEntry))
            {
                dbEntry.ModifiedBy = user.PortalUsername;
                dbEntry.ModifiedDate = DateTime.UtcNow;
            }

            await repository.SaveChanges();

            return LoadExpenseType(dbEntry);
        }

        #endregion
    }
}