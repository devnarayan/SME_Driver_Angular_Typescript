using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SME.TMS.API.Repo;
using Microsoft.Extensions.Configuration;
using SME.TMS.API.Interface;
using SME.TMS.API.Models;
using Microsoft.AspNetCore.Cors;
using SME.TMS.API.Interface.Responses;
using SME.TMS.API.Interface.Requests;
using Newtonsoft.Json.Linq;
using System.Transactions;
using System.Data.SqlClient;
using System.IO;
using System.Net.Http;
using System.Net;

namespace SME.TMS.API.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    [EnableCors("CorsPolicyAllowAll")]
    public class JournalController : Controller
    {
        private readonly IDriverRepository repository;
        private readonly IDriverRepository2 repository2;
        private readonly IConfiguration config;

        public JournalController(IDriverRepository repository,
            IDriverRepository2 repository2,
            IConfiguration configuration)
        {
            config = configuration;
            this.repository = repository;
            this.repository2 = repository2;
            //this._entryRepository = entryRepository;
        }

        [HttpPost]
        [ActionName("GetJournalLookups")]
        public async Task<IActionResult> GetJournalLookups([FromBody]GetJournalLookupRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GetJournalLookupResponse resp = new GetJournalLookupResponse();

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            resp.JournalTypes = await repository.GetAllJournalTypes();
            resp.MaintenanceTypes = await repository.GetAllMaintenanceTypes();
            resp.FrequencyTypes = await repository.GetAllFrequencyTypes();
            resp.LogoData = user.ReferencingCompany.Logo;

            return Ok(resp);
        }

        [HttpPost]
        [ActionName("GetJournalList")]
        public async Task<IActionResult> GetJournalList([FromBody]GetJournalListRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            List<JournalEntryModel> retList = new List<JournalEntryModel>();
            switch (req.JournalTypeId)
            {
                case (int)JournalType.Enum.Expenses:
                    break;
                case (int)JournalType.Enum.Recurring:
                    if (req.ContractId > 0)
                    {
                        var recurringList = await repository.GetRecurringJournalEntriesByContractId(req.ContractId);
                        retList.AddRange(recurringList.Where(x => x.CompanyId == user.CompanyId).Select(x => LoadJournalEntry(x)));
                        break;
                    }
                    else
                    {
                        var recurringList = await repository.GetRecurringJournalEntriesByDriverId(req.DriverId);
                        retList.AddRange(recurringList.Where(x => x.CompanyId == user.CompanyId).Select(x => LoadJournalEntry(x)));
                        break;
                    }

                case (int)JournalType.Enum.MaintenanceParts:
                    var maintenanceList = await repository.GetMaintenanceJournalEntriesByDriverId(req.DriverId);

                    retList.AddRange(maintenanceList.Where(x => x.CompanyId == user.CompanyId).Select(x => LoadJournalEntry(x)));
                    break;
                case (int)JournalType.Enum.Compliance:
                    break;
                case (int)JournalType.Enum.Adjustment:
                    break;
                default:
                    return NotFound();
            }


            //return Ok(resp);
            return Ok(LoadJournalEntries(req, retList));

        }


        private async Task<GetJournalListResposne> LoadJournalEntries(GetJournalListRequest req, List<JournalEntryModel> retList)
        {
            GetJournalListResposne resp = new GetJournalListResposne()
            {
                JournalEntries = retList
            };

            if (req.JournalEntryId > 0)
            {
                resp.CurrentJournalEntry = retList.FirstOrDefault(x => x.JournalEntryId == req.JournalEntryId);
            }
            else
            {
                if (retList.Count > 0)
                {
                    resp.CurrentJournalEntry = retList[0];
                }
            }


            //create sample records for offshore
            //TODO: WILL NEED TO POPULATE CORRECTLY 
            int recCounter = 0;

            foreach (JournalEntryModel jem in resp.JournalEntries)
            {
                //add 3 test transactions
                for (int i = 0; i < 3; i++)
                {
                    recCounter = recCounter + 1;

                    if (jem.SettledTransactions == null)
                    {
                        jem.SettledTransactions = new List<SettledTransactionModel>();
                    }

                    SettledTransactionModel sem = new SettledTransactionModel();
                    sem.PaymentNumber = "SME00000" + recCounter.ToString();
                    sem.SettledDate = new DateTime(2018, 1, 15);
                    sem.SettledTransactionId = recCounter;
                    sem.TransactionAmount = (recCounter * 110) + (.23m * decimal.Parse(recCounter.ToString()));
                    sem.TransactionDesc = "Test Trans " + recCounter.ToString();

                    jem.SettledTransactions.Add(sem);
                }
            }

            return resp;

        }


        [HttpPost]
        [ActionName("SaveJournalEntry")]
        public async Task<IActionResult> SaveJournalEntry([FromBody]SaveJournalEntryRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            SaveJournalEntryResponse resp = new SaveJournalEntryResponse
            {
                CurrentEntry = await SaveJournalEntryModel(user, req.JournalTypeId, ConvertJSONToModel(req.JournalEntry, req.JournalTypeId), repository)
            };

            return Ok(resp);
        }

        [HttpPost]
        [ActionName("SaveJournalEntryList")]
        public async Task<IActionResult> SaveJournalEntryList([FromBody]SaveJournalEntryListRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            GetJournalListResposne resp = new GetJournalListResposne();
            resp.JournalEntries = new List<JournalEntryModel>();

            using (var transaction = await repository.StartTransaction())
            {
                try
                {
                    foreach (var model in req.JournalEntries)
                    {
                        resp.JournalEntries.Add(await SaveJournalEntryModel(user, req.JournalTypeId, ConvertJSONToModel(model, (int)JournalType.Enum.Expenses), repository));
                    }

                    transaction.Commit();
                }
                catch (Exception e)
                {
                    transaction.Rollback();

                    return NotFound(e);
                }
            }

            return Ok(resp);
        }

        #region Utility

        public static JournalEntryModel ConvertJSONToModel(JToken json, int journalTypeId)
        {
            switch (journalTypeId)
            {
                case (int)JournalType.Enum.Recurring:
                    return json.ToObject<RecurringJounralEntryModel>();
                case (int)JournalType.Enum.MaintenanceParts:
                    return json.ToObject<MaintenanceJournalEntryModel>();
                case (int)JournalType.Enum.Expenses:
                case (int)JournalType.Enum.Compliance:
                case (int)JournalType.Enum.Adjustment:
                default:
                    throw new NullReferenceException("Journal Type does not exist.");
            }
        }



        /// <summary>
        /// Save a JournalEntryModel in a way specific to the type passed into the Journal Type Id.
        /// </summary>
        /// <param name="user">The user saving.</param>
        /// <param name="journalTypeId">The type of journal entry being saved.</param>
        /// <param name="model">The data to be saved to the database.</param>
        /// <returns></returns>
        public async static Task<JournalEntryModel> SaveJournalEntryModel(PortalUser user, int journalTypeId, JournalEntryModel model, IDriverRepository repository)
        {
            JournalEntryModel saveMe = model;
            JournalEntry dbEntry = null;

            switch (journalTypeId)
            {
                case (int)JournalType.Enum.Expenses:
                    break;
                case (int)JournalType.Enum.Recurring:
                    dbEntry = saveMe.JournalEntryId != 0 ? await repository.GetRecurringJournalEntryById(saveMe.JournalEntryId) : null;
                    break;
                case (int)JournalType.Enum.MaintenanceParts:
                    dbEntry = saveMe.JournalEntryId != 0 ? await repository.GetMaintenanceJournalEntryById(saveMe.JournalEntryId) : null;
                    break;
                case (int)JournalType.Enum.Compliance:
                    break;
                case (int)JournalType.Enum.Adjustment:
                    break;
                default:
                    throw new NullReferenceException("Journal Type does not exist.");
            }

            if (dbEntry != null && user.CompanyId != dbEntry.CompanyId)
                throw new NullReferenceException("Journal Type does not exist.");

            Driver driver = null;

            // Make sure the driver exists.
            if (saveMe.Driver == null && dbEntry == null)
                throw new NullReferenceException("Driver is required to create.");
            else if (saveMe.Driver != null)
            {
                driver = await repository.GetDriverById(saveMe.Driver.DriverId);

                if (driver == null && dbEntry == null)
                    throw new NullReferenceException($"Could not find driver with id {saveMe.Driver.DriverId}");
            }

            // Are we saving a new Journal or editing an old one?
            if (dbEntry == null && saveMe.JournalEntryId == 0)
            {
                dbEntry = new JournalEntry();
                repository.Insert(dbEntry);
                dbEntry.CreatedBy = user.PortalUsername;
                dbEntry.CreatedDate = DateTime.UtcNow;
            }
            else if (dbEntry == null)
                throw new NullReferenceException("Either Journal Entry Id or Jounral Type Id is incorrect.");

            dbEntry.JournalEntryName = saveMe.Name;
            dbEntry.SMEGLAccount = saveMe.SMEGLAccount;
            // This can only be bypassed if the record already exists and we arent changin the driver.
            // Otherwise this if statement should be true.
            if (driver != null)
            {
                dbEntry.DriverId = driver.DriverId;
            }
            dbEntry.DriverGLAccount = saveMe.DriverGLAccount;
            dbEntry.Description = saveMe.Description;
            dbEntry.CompanyId = user.CompanyId;
            dbEntry.Amount = saveMe.Amount;
            dbEntry.JournalTypeId = journalTypeId;
            dbEntry.JournalType = await repository.GetJournalTypeById(dbEntry.JournalTypeId);

            if (dbEntry.JournalType == null)
                throw new NullReferenceException("Could not find Journal Type.");

            dbEntry.IsActive = true;

            // Save extension table as well.
            switch (journalTypeId)
            {
                case (int)JournalType.Enum.Expenses:
                    break;
                case (int)JournalType.Enum.Recurring:
                    // Casting for ease.
                    RecurringJounralEntryModel recurring = (RecurringJounralEntryModel)saveMe;
                    if (dbEntry.RecurringExtension == null)
                    {
                        dbEntry.RecurringExtension = new JournalRecurringExtension();
                        repository.Insert(dbEntry.RecurringExtension);
                        dbEntry.RecurringExtension.CreatedBy = user.PortalUsername;
                        dbEntry.RecurringExtension.CreatedDate = DateTime.UtcNow;
                    }

                    dbEntry.RecurringExtension.CycleDue = recurring.CycleDue;
                    dbEntry.RecurringExtension.InterestRate = recurring.InterestRate;
                    dbEntry.RecurringExtension.FrequencyTypeId = recurring.FrequencyTypeId;
                    dbEntry.RecurringExtension.FrequencyType = await repository.GetFrequencyTypeById(recurring.FrequencyTypeId);

                    if (dbEntry.RecurringExtension.FrequencyType == null)
                        throw new NullReferenceException("The frequency type does not exist.");

                    dbEntry.RecurringExtension.LoanDate = recurring.LoanDate;
                    dbEntry.RecurringExtension.Settlements = recurring.Settlements;
                    dbEntry.RecurringExtension.IsActive = true;

                    if (repository.IsChanged(dbEntry.RecurringExtension))
                    {
                        dbEntry.RecurringExtension.ModifiedBy = user.PortalUsername;
                        dbEntry.RecurringExtension.ModifiedDate = DateTime.UtcNow;
                    }

                    break;
                case (int)JournalType.Enum.MaintenanceParts:
                    // Casting for ease.
                    MaintenanceJournalEntryModel maintenance = (MaintenanceJournalEntryModel)saveMe;
                    if (dbEntry.MaintenanceExtension == null)
                    {
                        dbEntry.MaintenanceExtension = new JournalMaintenanceExtension();
                        repository.Insert(dbEntry.MaintenanceExtension);
                        dbEntry.MaintenanceExtension.CreatedBy = user.PortalUsername;
                        dbEntry.MaintenanceExtension.CreatedDate = DateTime.UtcNow;
                    }

                    dbEntry.MaintenanceExtension.IsActive = true;
                    dbEntry.MaintenanceExtension.TransactionDate = maintenance.TransactionDate;
                    dbEntry.MaintenanceExtension.MaintenanceTypeId = maintenance.MaintenanceTypeId;
                    dbEntry.MaintenanceExtension.MaintenanceType = await repository.GetMaintenanceById(maintenance.MaintenanceTypeId);

                    if (dbEntry.MaintenanceExtension.MaintenanceType == null)
                        throw new NullReferenceException("The maintenance type does not exist.");

                    if (repository.IsChanged(dbEntry.MaintenanceExtension))
                    {
                        dbEntry.MaintenanceExtension.ModifiedBy = user.PortalUsername;
                        dbEntry.MaintenanceExtension.ModifiedDate = DateTime.UtcNow;
                    }

                    break;
                case (int)JournalType.Enum.Compliance:
                    break;
                case (int)JournalType.Enum.Adjustment:
                    break;
                default:
                    break;
            }

            if (repository.IsChanged(dbEntry))
            {
                dbEntry.ModifiedBy = user.PortalUsername;
                dbEntry.ModifiedDate = DateTime.UtcNow;
            }

            await repository.SaveChanges();

            return LoadJournalEntry(dbEntry);
        }


        /// <summary>
        /// Will convert a dbModel to its DTO pair.
        /// </summary>
        /// <param name="dbModel">The Journal Entry that we are converting to a DTO.</param>
        /// <returns>The DTO that represent the journal entry provided.</returns>
        public static JournalEntryModel LoadJournalEntry(JournalEntry dbModel)
        {
            JournalEntryModel ret = null;

            switch (dbModel.JournalTypeId)
            {
                case (int)JournalType.Enum.Expenses:
                    break;
                case (int)JournalType.Enum.Recurring:
                    ret = new RecurringJounralEntryModel()
                    {
                        Settlements = dbModel.RecurringExtension.Settlements,
                        CycleDue = dbModel.RecurringExtension.CycleDue != null ? (decimal)dbModel.RecurringExtension.CycleDue : 0,
                        FrequencyName = dbModel.RecurringExtension.FrequencyType.FrequencyName,
                        FrequencyTypeId = dbModel.RecurringExtension.FrequencyType.FrequencyTypeId,
                        InterestRate = dbModel.RecurringExtension.InterestRate,
                        LoanDate = dbModel.RecurringExtension.LoanDate
                    };
                    break;
                case (int)JournalType.Enum.MaintenanceParts:
                    ret = new MaintenanceJournalEntryModel()
                    {
                        MaintenanceTypeId = dbModel.MaintenanceExtension.MaintenanceType.MaintenanceTypeId,
                        MaintenanceTypeName = dbModel.MaintenanceExtension.MaintenanceType.MaintenanceTypeName,
                        TransactionDate = dbModel.MaintenanceExtension.TransactionDate
                    };
                    break;
                case (int)JournalType.Enum.Compliance:
                    break;
                case (int)JournalType.Enum.Adjustment: break;
                default:
                    throw new ArgumentException("Journal Type does not exist.");
            }

            ret.Amount = dbModel.Amount;
            ret.Description = dbModel.Description;
            if (dbModel.Driver != null)
            {
                // TODO: transfer driver info here.
                ret.Driver = new DriverModel()
                {
                    DriverId = dbModel.DriverId,
                    DriverFirstName = dbModel.Driver.FirstName,
                    DriverLastName = dbModel.Driver.LastName,
                    HireDate = dbModel.Driver.HireDate ?? new DateTime(2000, 1, 1),
                    TermDate = dbModel.Driver.TermDate,
                    DriverLicenseNumber = dbModel.Driver.DriverLicenseNumber
                };
            }
            else
            {
                ret.Driver = new DriverModel();
            }

            ret.DriverGLAccount = dbModel.DriverGLAccount;
            ret.JournalEntryId = dbModel.JournalEntryId;
            ret.Name = dbModel.JournalEntryName;
            ret.SMEGLAccount = dbModel.SMEGLAccount;
            ret.Type = dbModel.JournalType.JournalTypeName;
            ret.Contract = new ContractModel()
            {
                ContractId = dbModel.ContractId
            };


            return ret;
        }
        #endregion

        #region Journal Import
        [HttpPost]
        [ActionName("SaveJournalImport")]
        public async Task<IActionResult> SaveJournalImport([FromBody]SaveJournalImportRequest req)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

                if (user == null)
                    return NotFound();

                JournalImportModel saveMe = req.JournalEntry.docfile;

                JournalImport dbEntry = null;

                // Make sure the driver exists.
                if (saveMe.JournalEntryID == null || saveMe.JournalEntryID == 0)
                    throw new NullReferenceException("JournalEntryID is required.");

                // Are we saving a new Journal or editing an old one?
                dbEntry = new JournalImport();
                repository.Insert(dbEntry);
                dbEntry.CreatedBy = user.PortalUsername;
                dbEntry.DocTitle = saveMe.DocTitle;
                dbEntry.ContentType = saveMe.ContentType;
                dbEntry.CreatedDate = DateTime.UtcNow;
                dbEntry.JournalEntryID = saveMe.JournalEntryID;
                dbEntry.FileName = saveMe.FileName;

                Byte[] bytes = Convert.FromBase64String(saveMe.FileData64String);
                dbEntry.FileData = bytes;

                await repository.SaveChanges();

                JournalImportModel resp = new JournalImportModel();
                resp = LoadJournalImport(dbEntry);
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [ActionName("GetJournalImportList")]
        public async Task<IActionResult> GetJournalImportList([FromBody]GetJournalImportRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            var list = await repository.GetJournalImportListById(req.JournalEntryId.Value);

            GetJournalImportResponse resp = new GetJournalImportResponse();
            resp.Result = LoadJournalImports(list);

            return Ok(resp);
        }


        [HttpPost]
        [ActionName("DeleteJournalImport")]
        public async Task<IActionResult> DeleteJournalImport([FromBody]GetJournalImportRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            var response = repository.DeleteJournalImportById(req.JournalImportId);
            return Ok(response);
        }

        [ActionName("DownloadJournalImport")]
        public ActionResult DownloadJournalImport2(string imageId)
        {
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);

            Guid gid = new Guid(imageId);
            var dbModel = repository.GetJournalImportById(gid).Result;

            if (dbModel == null)
            {
                response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return null;
            }

            Stream stream = new MemoryStream(dbModel.FileData);

            response.Content = new StreamContent(stream);
            response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
            response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment") { FileName = Path.GetFileName(dbModel.DocTitle) };
            // return response;
            response.Content.Headers.ContentDisposition.FileName = dbModel.FileName;

            return File(stream, System.Net.Mime.MediaTypeNames.Application.Octet, dbModel.FileName);
        }
        /// <summary>
        /// Will convert a dbModel to its DTO pair.
        /// </summary>
        public static JournalImportModel LoadJournalImport(JournalImport dbModel)
        {
            JournalImportModel ret = new JournalImportModel
            {
                CreatedBy = dbModel.CreatedBy,
                CreatedDate = dbModel.CreatedDate,
                DocTitle = dbModel.DocTitle,
                ContentType = dbModel.ContentType,
                FileName = dbModel.FileName,
                JournalEntryID = dbModel.JournalEntryID,
                JournalImportId = dbModel.JournalImportId
            };

            return ret;
        }

        public static List<JournalImportModel> LoadJournalImports(List<JournalImport> dbModel)
        {
            List<JournalImportModel> retList = new List<JournalImportModel>();

            foreach (var model in dbModel)
            {
                JournalImportModel ret = new JournalImportModel();

                ret.CreatedBy = model.CreatedBy;
                ret.CreatedDate = model.CreatedDate;
                ret.DocTitle = model.DocTitle;
                ret.ContentType = model.ContentType;
                ret.FileName = model.FileName;
                ret.JournalEntryID = model.JournalEntryID;
                ret.JournalImportId = model.JournalImportId;
                retList.Add(ret);
            }
            return retList;
        }

        #endregion

        #region  MassEntry
        [HttpPost]
        [ActionName("GetTemplateDefinition")]
        public async Task<IActionResult> GetTemplateDefinition([FromBody]GetTemplateDefinitionRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            var list = await repository2.GetTemplateDefinitiontAll();
            return Ok(list);
        }

        [HttpPost]
        [ActionName("GetTruckDriverList")]
        public async Task<IActionResult> GetTruckDriverList([FromBody]GetTemplateDefinitionRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            var list = await repository2.GetTruckDriverForContract();
            return Ok(list);
        }

        List<TemplateDefinitionModel> LoadTempDefinition(List<TemplateDefinition> dbModel)
        {
            List<TemplateDefinitionModel> retList = new List<TemplateDefinitionModel>();

            foreach (var model in dbModel)
            {
                TemplateDefinitionModel ret = new TemplateDefinitionModel();

                ret.TemplateDefinitionId = model.TemplateDefinitionId;
                ret.TemplateDefinitionName = model.TemplateDefinitionName;
                ret.TemplateDefinitionDesc = model.TemplateDefinitionDesc;
                ret.TemplateDefinitionSchema = model.TemplateDefinitionSchema;
                ret.VendorId = model.VendorId;
                retList.Add(ret);
            }
            return retList;
        }

        /// <summary>
        /// Download sample csv file for mass entry.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// 
        [Produces("text/csv")]
        [ActionName("GetTemplateCSV.csv")]
        public async Task<string> GetTemplateCSV(int id)
        {
            var schema = await repository2.GetTemplateDefinitiontById(id);
            var schemas = schema.TemplateDefinitionSchema;

            return schemas;
        }


        [HttpPost]
        [ActionName("ImportTempDefinition")]
        public async Task<IActionResult> ImportTempDefinition([FromBody]ExpenseMassImportRequest req)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

                if (user == null)
                    return NotFound();

                JournalImportModel saveMe = req.JournalEntry.docfile;
                List<ImportedExpenseModel> modelList = new List<ImportedExpenseModel>();

                Byte[] bytes = Convert.FromBase64String(saveMe.FileData64String);
                Stream stream = new MemoryStream(bytes);
                bool isHeader = true;
                using (var reader = new StreamReader(stream))
                {
                    int index = 0;
                    List<string> listA = new List<string>();
                    while (!reader.EndOfStream)
                    {
                        var line = reader.ReadLine();
                        var values = line.Split(',');

                        if (isHeader)
                        {
                            isHeader = false;
                            foreach (var prop in values)
                            {
                                listA.Add(prop);
                            }
                        }
                        else
                        {
                            var model = new ImportedExpenseModel
                            {
                                ImportedExpenseId = index++,
                                TemplateDefinitionId = req.JournalEntry.docfile.JournalEntryID
                            };

                            for (int i = 0; i < listA.Count; i++)
                            {
                                if (listA[i].Trim('"').Contains("ContractId"))
                                {
                                    if (values.Length >= i)
                                    {
                                        var bl = int.TryParse(values[i].Trim('"'), out int contractId);
                                        model.ContractId = contractId;
                                    }
                                }
                                else if (listA[i].Trim('"').Contains("DriverAmount"))
                                {
                                    if (values.Length >= i)
                                    {
                                        var bl = decimal.TryParse(values[i].Trim('"'), out decimal contractId);
                                        model.DriverAmount = contractId;
                                    }
                                }
                                else if (listA[i].Trim('"').Contains("DriverId"))
                                {
                                    if (values.Length >= i)
                                    {
                                        var bl = int.TryParse(values[i].Trim('"'), out int contractId);
                                        model.DriverId = contractId;
                                    }
                                }
                                else if (listA[i].Trim('"').Contains("ImportByUser"))
                                {
                                    if (values.Length >= i)
                                    {
                                        model.ImportByUser = values[i].Trim('"');
                                    }
                                }
                                else if (listA[i].Trim('"').Contains("ImportDate"))
                                {
                                    if (values.Length >= i)
                                    {
                                        var bl = DateTime.TryParse(values[i].Trim('"'), out DateTime contractId);
                                        model.ImportDate = contractId;
                                    }
                                }
                                else if (listA[i].Trim('"').Contains("IsOpen"))
                                {
                                    if (values.Length >= i)
                                    {
                                        var bl = Boolean.TryParse(values[i].Trim('"'), out Boolean contractId);
                                        model.IsOpen = contractId;
                                    }
                                }
                                else if (listA[i].Trim('"').Contains("SMEAmount"))
                                {
                                    if (values.Length >= i)
                                    {
                                        var bl = decimal.TryParse(values[i].Trim('"'), out decimal value);
                                        model.SMEAmount = value;
                                    }
                                }
                                else if (listA[i].Trim('"').Contains("TransactionDate"))
                                {
                                    if (values.Length >= i)
                                    {
                                        var bl = DateTime.TryParse(values[i].Trim('"'), out DateTime value);
                                        model.TransactionDate = value;
                                    }
                                }
                                else if (listA[i].Trim('"').Contains("TransactionDesc"))
                                {
                                    if (values.Length >= i)
                                    {
                                        model.TransactionDesc = values[i].Trim('"');
                                    }
                                }
                                else if (listA[i].Trim('"').Contains("TransactionNumber"))
                                {
                                    if (values.Length >= i)
                                    {
                                        model.TransactionNumber = values[i].Trim('"');
                                    }
                                }
                                else if (listA[i].Trim('"').Contains("TruckId"))
                                {
                                    if (values.Length >= i)
                                    {
                                        var bl = int.TryParse(values[i].Trim('"'), out int value);
                                        model.TruckId = value;
                                    }
                                }

                            }
                            modelList.Add(model);

                        }
                    }
                }

                return Ok(modelList);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [ActionName("SaveExpenseMassData")]
        public async Task<IActionResult> SaveExpenseMassData([FromBody]SaveExpenseMassImportRequest req)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

                if (user == null)
                    return NotFound();
                foreach (var saveMe in req.ExpenseModal)
                {
                    ImportedExpense dbEntry = null;

                    // Make sure the driver exists.
                    if (saveMe.TemplateDefinitionId == null || saveMe.TemplateDefinitionId == 0)
                        throw new NullReferenceException("TemplateDefinitionId is required.");

                    // Are we saving a new Journal or editing an old one?
                    dbEntry = new ImportedExpense();
                    repository.Insert(dbEntry);
                    dbEntry.ContractId = saveMe.ContractId;
                    dbEntry.DriverAmount = saveMe.DriverAmount;
                    dbEntry.DriverId = saveMe.DriverId;
                    dbEntry.ImportByUser = saveMe.ImportByUser;
                    dbEntry.ImportDate = DateTime.UtcNow;
                    dbEntry.IsOpen = saveMe.IsOpen;
                    dbEntry.SMEAmount = saveMe.SMEAmount;
                    dbEntry.TemplateDefinitionId = saveMe.TemplateDefinitionId;
                    dbEntry.TransactionDate = saveMe.TransactionDate.Value.Year==1? (DateTime?)null : saveMe.TransactionDate;
                    dbEntry.TransactionDesc = saveMe.TransactionDesc;
                    dbEntry.TransactionNumber = saveMe.TransactionNumber;
                    dbEntry.TruckId = saveMe.TruckId;

                    await repository.SaveChanges();
                }

                return Ok(req.ExpenseModal);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        #endregion
    }
}