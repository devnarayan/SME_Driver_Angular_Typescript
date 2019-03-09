using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using SME.TMS.API.Interface;
using SME.TMS.API.Models;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cors;
using SME.TMS.API.Repo;
using SME.TMS.API.Interface.Responses;
using SME.TMS.API.Interface.Requests;

namespace SME.TMS.API.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    [EnableCors("CorsPolicyAllowAll")]
    public class DriverController : Controller
    {
        private readonly IDriverRepository repository;
        private readonly IConfiguration config;

        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        public DriverController(IDriverRepository repository, IConfiguration configuration)
        {
            config = configuration;
            this.repository = repository;
        }


        [HttpPost]
        [ActionName("GetDriverLookups")]
        public async Task<IActionResult> GetDriverLookups([FromBody]GetDriverLookupsRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GetDriverLookupsResponse resp = new GetDriverLookupsResponse();

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            resp.GenderTypes = await repository.GetAllGenderTypes();
            resp.PhoneNumberTypes = await repository.GetAllPhoneNumberTypes();
            resp.StateProvinces = await repository.GetAllStateProvinces();
            resp.InsuranceProviders = await repository.GetAllInsuranceProviders();
            resp.MedicalProviders = await repository.GetAllMedicalProviders();
            resp.EthnicityTypes = await repository.GetAllEthnicityTypes();
            resp.LogoData = user.ReferencingCompany.Logo;

            return Ok(resp);
        }
        

        [HttpPost]
        [ActionName("GetDriverList")]
        public async Task<IActionResult> GetDriverList([FromBody]GetDriverRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GetDriverListResponse resp = new GetDriverListResponse();
            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            var drivers = await repository.GetDriversByCompanyId(user.CompanyId);
            foreach (Driver d in drivers)
            {
                resp.DriverList.Add(new DriverListModel
                {
                    DriverId = d.DriverId,
                    DriverFullName = d.FirstName + ' ' + d.LastName
                });
            }

            return Ok(resp);
        }


        [HttpPost]
        [ActionName("GetDriver")]
        public async Task<IActionResult> GetDriver([FromBody]GetDriverRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (req.DriverId == 0)
            {
                req.DriverId = 1;
            }

            repository.SetTimeout(120);

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            var driver = await repository.GetDriverById(req.DriverId);

            if (driver == null)
            {
                return NotFound();
            }
            else if (driver.CompanyId != user.CompanyId)
                return NotFound();
            else
            {
                return Ok(LoadDriver(driver));
            }


        }

        private async Task<GetDriverResponse> LoadDriver(Driver driver)
        {
            GetDriverResponse resp = new GetDriverResponse();

            var ethnicity = await repository.GetEthnicityTypeById(driver.EthnicityTypeId);

            DriverModel dm = new DriverModel()
            {
                CurrentPayPeriod = new DateTime(2017, 11, 3),
                DateOfBirth = driver.DateOfBirth ?? DateTime.MinValue,
                DriverAccountingId = driver.AccountingDriverId,
                DriverCity = driver.City,
                DriverFirstName = driver.FirstName,
                DriverFullName = driver.FirstName + ' ' + driver.LastName,
                DriverLastName = driver.LastName,
                DriverLicenseExpirationDate = driver.DriverLicenseExpiration,
                DriverLicenseNumber = driver.DriverLicenseNumber,
                DriverReportURL = "http://www.google.com",
                DriverStateProvinceId = driver.StateProvinceId ?? 0,
                DriverStateProvinceName = (await repository.GetStateProvinceById(driver.StateProvinceId ?? 0))?.StateProvinceName ?? "",
                DriverStreetAddressLine1 = driver.StreetAddressLine1,
                DriverStreetAddressLine2 = driver.StreetAddressLine2,
                DriverZip = driver.Zip,
                EthnicityID = "",
                GenderID = driver.GenderTypeId ?? 0,
                HireDate = driver.HireDate ?? DateTime.MinValue,
                IsActive = driver.IsActive ?? false,
                TermDate = driver.TermDate,
                DriverId = driver.DriverId,
                EthnicityTypeId = ethnicity.EthnicityTypeId,
                EthnicityTypeName = ethnicity.EthnicityTypeName,
                IsMinority = ethnicity.IsMinority
            };

            resp.CurrentDriver = dm;

            //setup the multiple rows of dataas well
            var contracts = await repository.GetDriverContractsByDriverId(driver.DriverId);
            foreach (DriverContract dc in contracts)
            {
                resp.CurrentDriver.DriverContracts.Add(new DriverContractModel
                {
                    DriverContractEndDate = dc.Contract.ContractEndDate ?? DateTime.MinValue,
                    DriverContractID = dc.DriverContractId,
                    DriverContractName = dc.Contract.ContractName,
                    DriverContractNumber = dc.Contract.ContractNumber,
                    DriverContractStartDate = dc.Contract.ContractStartDate,
                    DriverID = dc.DriverId
                });
            }

            var emails = await repository.GetDriverEmailsByDriverId(driver.DriverId);
            foreach (DriverEmail de in emails)
            {
                resp.CurrentDriver.DriverEmails.Add(new DriverEmailModel
                {
                    DriverEmailAddress = de.DriverEmailAddress,
                    DriverEmailAddressID = de.DriverEmailId,
                    DriverID = de.DriverId,
                    IsPrimary = de.IsPrimary
                });
            }

            var meds = await repository.GetDriverMedicalHistoryByDriverId(driver.DriverId);
            foreach (DriverMedicalHistory med in meds)
            {
                resp.CurrentDriver.DriverMedicalEvaluations.Add(new DriverMedicalEvaluationModel
                {
                    DriverID = med.DriverId,
                    DriverMedicalEffectiveDate = med.MedicalExamEffectiveDate,
                    DriverMedicalEvaluationID = med.DriverMedicalHistoryId,
                    DriverMedicalExpirationDate = med.MedicalExamExpirationDate,
                    DriverMedicalProviderID = med.MedicalProviderId,
                    DriverMedicalProviderName = med.MedicalProvider.MedicalProviderName,
                    DriverMedicalProviderRate = med.MedicalExamRate
                });
            }

            var phones = await repository.GetDriverPhonesByDriverId(driver.DriverId);
            foreach (DriverPhone phone in phones)
            {
                resp.CurrentDriver.DriverPhones.Add(new DriverPhoneModel
                {
                    DriverID = phone.DriverId,
                    DriverPhoneID = phone.DriverPhoneId,
                    DriverPhoneNumber = phone.DriverPhoneNumber,
                    DriverPhoneTypeID = phone.PhoneNumberTypeId,
                    IsPrimary = phone.IsPrimary
                });
            }

            var insurances = await repository.GetDriverInsuranceByDriverId(driver.DriverId);
            foreach (DriverInsurance insurance in insurances)
            {
                resp.CurrentDriver.DriverInsurances.Add(new DriverInsuranceModel
                {
                    DriverID = insurance.DriverId,
                    DriverInsuranceEndDate = insurance.InsuranceEndDate ?? DateTime.MinValue,
                    DriverInsuranceID = insurance.DriverInsuranceId,
                    DriverInsuranceProviderID = insurance.InsuranceProviderId,
                    DriverInsuranceProviderRate = insurance.InsuranceRate,
                    DriverInsuranceStartDate = insurance.InsuranceEffectiveDate,
                    DriverInsureanceProviderName = insurance.InsuranceProvider.InsuranceProviderName
                });
            }


            //get the recent info from the retrieved
            var recentInsurance = resp.CurrentDriver.DriverInsurances.OrderByDescending(i => i.DriverInsuranceStartDate).FirstOrDefault();
            if (recentInsurance != null)
            {
                resp.CurrentDriver.RecentDriverInsurancePolicyURL = "www.yahoo.com";
                resp.CurrentDriver.RecentDriverInsuranceProviderId = recentInsurance.DriverInsuranceProviderID;
                resp.CurrentDriver.RecentDriverInsuranceProviderRate = recentInsurance.DriverInsuranceProviderRate;
                resp.CurrentDriver.RecentDriverInsureanceProviderName = recentInsurance.DriverInsureanceProviderName;
            }

            var recentMedEval = resp.CurrentDriver.DriverMedicalEvaluations.OrderByDescending(m => m.DriverMedicalEffectiveDate).FirstOrDefault();
            if (recentMedEval != null)
            {
                resp.CurrentDriver.RecentDriverEvaluationDate = recentMedEval.DriverMedicalEffectiveDate;
                resp.CurrentDriver.RecentDriverMedicalExpirationDate = recentMedEval.DriverMedicalExpirationDate;
            }

            return resp;

        }


        [HttpPost]
        [ActionName("SaveDriver")]
        public async Task<IActionResult> SaveDriver([FromBody]SaveDriverRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            repository.SetTimeout(120);

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            var existingDriver = await repository.GetDriverById(req.CurrentDriver.DriverId);

            if (existingDriver == null && req.CurrentDriver.DriverId > 0)
            {
                return NotFound();
            }
            else if (existingDriver == null)
            {
                existingDriver = new Driver();
                //set any defaults for new driver
                existingDriver.Cap2Percent = 0;
                existingDriver.Company = "";
                existingDriver.ContractExp = new DateTime(1900, 1, 1);
                existingDriver.ContractTerm = 1;
                existingDriver.DashNotes = "";
                existingDriver.Dcxsupplier = false;
                existingDriver.DcxsupplierId = "";
                existingDriver.FirstName2 = "";
                existingDriver.FlatRate = 0;
                existingDriver.IsCoDriver = 0;
                existingDriver.IsDirDeposit = false;
                existingDriver.IsReserveFor1099 = false;
                existingDriver.Label = false;
                existingDriver.LastName2 = "";
                existingDriver.MailTo = "";
                existingDriver.Mn = "";
                existingDriver.Mn2 = "";
                existingDriver.NewPayDisplayNotes = "";
                existingDriver.Ssn = "";
                existingDriver.PayrollId = "";
                existingDriver.PercentRetained = 0;
                existingDriver.Terminal = "";
                existingDriver.TransferredFrom = "";
                existingDriver.TruckValue = 0;
                existingDriver.WorkingDeposit = 0;
                existingDriver.EthnicityTypeId = 1;
                existingDriver.ModifiedBy = req.CurrentUser.UserName;
                existingDriver.ModifiedDate = DateTime.UtcNow;
                existingDriver.CreatedBy = req.CurrentUser.UserName;
                existingDriver.CreatedDate = DateTime.UtcNow;

            }
            else if (existingDriver.CompanyId != user.CompanyId)
                return NotFound();


            existingDriver.DriverId = req.CurrentDriver.DriverId;
            existingDriver.AccountingDriverId = req.CurrentDriver.DriverAccountingId;
            existingDriver.City = req.CurrentDriver.DriverCity;            
            if(req.CurrentDriver.DateOfBirth>DateTime.MinValue)
                existingDriver.DateOfBirth = req.CurrentDriver.DateOfBirth;

            if(req.CurrentDriver.DriverLicenseExpirationDate != null && req.CurrentDriver.DriverLicenseExpirationDate > DateTime.MinValue)
                existingDriver.DriverLicenseExpiration = req.CurrentDriver.DriverLicenseExpirationDate;
            else
                existingDriver.DriverLicenseExpiration = null;

            existingDriver.DriverLicenseNumber = req.CurrentDriver.DriverLicenseNumber;
            existingDriver.DriverLicenseStateProvinceId = req.CurrentDriver.DriverStateProvinceId;
            existingDriver.FirstName = req.CurrentDriver.DriverFirstName;
            existingDriver.GenderType = await repository.GetGenderTypeById(req.CurrentDriver.GenderID);
            existingDriver.GenderTypeId = req.CurrentDriver.GenderID;
            if (req.CurrentDriver.HireDate > DateTime.MinValue)
                existingDriver.HireDate = req.CurrentDriver.HireDate;
            existingDriver.CompanyId = user.CompanyId;
            existingDriver.Inactive = !req.CurrentDriver.IsActive;
            existingDriver.IsActive = req.CurrentDriver.IsActive;
            existingDriver.LastName = req.CurrentDriver.DriverLastName;
            existingDriver.Minority = false;
            existingDriver.StateProvince = await repository.GetStateProvinceById(req.CurrentDriver.DriverStateProvinceId);
            existingDriver.StateProvinceAbbrev = existingDriver.StateProvince.StateProvinceAbbreviation;
            existingDriver.StateProvinceId = req.CurrentDriver.DriverStateProvinceId;
            existingDriver.StreetAddressLine1 = req.CurrentDriver.DriverStreetAddressLine1;
            existingDriver.StreetAddressLine2 = req.CurrentDriver.DriverStreetAddressLine2;
            if (req.CurrentDriver.TermDate != null && req.CurrentDriver.TermDate > DateTime.MinValue)
                existingDriver.TermDate = req.CurrentDriver.TermDate;
            else
                existingDriver.TermDate = null;
            existingDriver.Zip = req.CurrentDriver.DriverZip;
            var tempEthnicityType = await repository.GetEthnicityTypeById(req.CurrentDriver.EthnicityTypeId);
            if(tempEthnicityType != null)
            {
                existingDriver.EthnicityType = tempEthnicityType;
                existingDriver.EthnicityTypeId = tempEthnicityType.EthnicityTypeId;
            }

            //determine if we insert 
            if (req.CurrentDriver.DriverId == 0)
            {
                repository.Insert(existingDriver);
                await repository.SaveChanges();
            }
            else
            {                
                existingDriver.ModifiedBy = req.CurrentUser.UserName;
                existingDriver.ModifiedDate = DateTime.UtcNow;

                repository.Attach(existingDriver);
                await repository.SaveChanges();
            }

            //create a placeholder object to hold all the collections
            Driver tempDriverFromCaller = new Driver();

            foreach(DriverPhoneModel p in req.CurrentDriver.DriverPhones)
            {
                var existingPhone = await repository.GetDriverPhoneById(p.DriverPhoneID);

                if (existingPhone == null && p.DriverPhoneID > 0)
                {
                    continue; //skip this record no longer exists or wrong data
                }
                else if (existingPhone == null)
                {
                    existingPhone = new DriverPhone();
                }

                existingPhone.DriverId = existingDriver.DriverId;
                existingPhone.DriverPhoneNumber = p.DriverPhoneNumber;
                existingPhone.PhoneNumberTypeId = p.DriverPhoneTypeID;
                existingPhone.PhoneNumberType = await repository.GetPhoneNumberTypeById(p.DriverPhoneTypeID);
                existingPhone.IsActive = true;
                existingPhone.IsPrimary = p.IsPrimary;

                if (existingPhone.DriverPhoneId <= 0)
                {
                    existingPhone.CreatedBy = req.CurrentUser.UserName;
                    existingPhone.CreatedDate = DateTime.UtcNow;
                    existingPhone.ModifiedBy = req.CurrentUser.UserName;
                    existingPhone.ModifiedDate = DateTime.UtcNow;

                    repository.Insert(existingPhone);

                }
                else
                {
                    if (repository.GetEntityState(existingPhone) == (int)EntityState.Modified)
                    {

                        existingPhone.ModifiedBy = req.CurrentUser.UserName;
                        existingPhone.ModifiedDate = DateTime.UtcNow;

                        repository.Attach(existingPhone);
                    }
                }

                await repository.SaveChanges();

                //add to temp for compare on deletes
                tempDriverFromCaller.DriverPhone.Add(existingPhone);
            }

            foreach (DriverEmailModel p in req.CurrentDriver.DriverEmails)
            {
                var existingEmail = await repository.GetDriverEmailById(p.DriverEmailAddressID);

                if (existingEmail == null && p.DriverEmailAddressID > 0)
                {
                    continue; //skip this record no longer exists or wrong data
                }
                else if (existingEmail == null)
                {
                    existingEmail = new DriverEmail();
                }

                existingEmail.DriverId = existingDriver.DriverId;
                existingEmail.DriverEmailAddress = p.DriverEmailAddress;
                existingEmail.IsActive = true;
                existingEmail.IsPrimary = p.IsPrimary;

                if (existingEmail.DriverEmailId <= 0)
                {
                    existingEmail.CreatedBy = req.CurrentUser.UserName;
                    existingEmail.CreatedDate = DateTime.UtcNow;
                    existingEmail.ModifiedBy = req.CurrentUser.UserName;
                    existingEmail.ModifiedDate = DateTime.UtcNow;

                    repository.Insert(existingEmail);

                }
                else
                {
                    if (repository.GetEntityState(existingEmail) == (int)EntityState.Modified)
                    {
                        existingEmail.ModifiedBy = req.CurrentUser.UserName;
                        existingEmail.ModifiedDate = DateTime.UtcNow;

                        repository.Attach(existingEmail);
                    }
                }

                await repository.SaveChanges();

                //add to temp for compare on deletes
                tempDriverFromCaller.DriverEmail.Add(existingEmail);
            }

            foreach (DriverMedicalEvaluationModel p in req.CurrentDriver.DriverMedicalEvaluations)
            {
                var existingMedicalEvaluation = await repository.GetDriverMedicalHistoryById(p.DriverMedicalEvaluationID);

                if (existingMedicalEvaluation == null && p.DriverMedicalEvaluationID > 0)
                {
                    continue; //skip this record no longer exists or wrong data
                }
                else if (existingMedicalEvaluation == null)
                {
                    existingMedicalEvaluation = new DriverMedicalHistory();
                }

                existingMedicalEvaluation.DriverId = existingDriver.DriverId;
                existingMedicalEvaluation.MedicalProviderId = p.DriverMedicalProviderID;
                existingMedicalEvaluation.MedicalExamEffectiveDate = p.DriverMedicalEffectiveDate;
                existingMedicalEvaluation.MedicalExamExpirationDate = p.DriverMedicalExpirationDate;
                existingMedicalEvaluation.MedicalExamRate = p.DriverMedicalProviderRate;
                existingMedicalEvaluation.IsActive = true;

                if (existingMedicalEvaluation.DriverMedicalHistoryId <= 0)
                {
                    existingMedicalEvaluation.CreatedBy = req.CurrentUser.UserName;
                    existingMedicalEvaluation.CreatedDate = DateTime.UtcNow;
                    existingMedicalEvaluation.ModifiedBy = req.CurrentUser.UserName;
                    existingMedicalEvaluation.ModifiedDate = DateTime.UtcNow;

                    repository.Insert(existingMedicalEvaluation);

                }
                else
                {
                    if (repository.GetEntityState(existingMedicalEvaluation) == (int)EntityState.Modified)
                    {
                        existingMedicalEvaluation.ModifiedBy = req.CurrentUser.UserName;
                        existingMedicalEvaluation.ModifiedDate = DateTime.UtcNow;

                        repository.Attach(existingMedicalEvaluation);
                    }
                }

                await repository.SaveChanges();

                //add to temp for compare on deletes
                tempDriverFromCaller.DriverMedicalHistory.Add(existingMedicalEvaluation);
            }

            foreach (DriverInsuranceModel p in req.CurrentDriver.DriverInsurances)
            {
                var existingInsurance = await repository.GetDriverInsuranceById(p.DriverInsuranceID);

                if (existingInsurance == null && p.DriverInsuranceID > 0)
                {
                    continue; //skip this record no longer exists or wrong data
                }
                else if (existingInsurance == null)
                {
                    existingInsurance = new DriverInsurance();
                }

                existingInsurance.DriverId = existingDriver.DriverId;
                existingInsurance.InsuranceProviderId = p.DriverInsuranceProviderID;
                existingInsurance.InsuranceRate = p.DriverInsuranceProviderRate;
                existingInsurance.InsuranceEffectiveDate = p.DriverInsuranceStartDate;
                existingInsurance.InsuranceEndDate = p.DriverInsuranceEndDate;
                existingInsurance.IsActive = true;

                if (existingInsurance.DriverInsuranceId <= 0)
                {
                    existingInsurance.CreatedBy = req.CurrentUser.UserName;
                    existingInsurance.CreatedDate = DateTime.UtcNow;
                    existingInsurance.ModifiedBy = req.CurrentUser.UserName;
                    existingInsurance.ModifiedDate = DateTime.UtcNow;

                    repository.Insert(existingInsurance);

                }
                else
                {
                    if (repository.GetEntityState(existingInsurance) == (int)EntityState.Modified)
                    {
                        existingInsurance.ModifiedBy = req.CurrentUser.UserName;
                        existingInsurance.ModifiedDate = DateTime.UtcNow;

                        repository.Attach(existingInsurance);
                    }
                }

                await repository.SaveChanges();

                //add to temp for compare on deletes
                tempDriverFromCaller.DriverInsurance.Add(existingInsurance);
            }

            var curPhones = await repository.GetDriverPhonesByDriverId(existingDriver.DriverId);
            var curEmails = await repository.GetDriverEmailsByDriverId(existingDriver.DriverId);
            var curInsurance = await repository.GetDriverInsuranceByDriverId(existingDriver.DriverId);
            var curMedicalHistory = await repository.GetDriverMedicalHistoryByDriverId(existingDriver.DriverId);

            //delete any collection records that no longer exist
            foreach (DriverPhone p in curPhones)
            {
                var found = tempDriverFromCaller.DriverPhone.FirstOrDefault(o => o.DriverPhoneId == p.DriverPhoneId);
                //if its not found then delete it from database
                if (found == null)
                {
                    repository.Delete(p);
                    await repository.SaveChanges();
                }
            }

            foreach (DriverEmail p in curEmails)
            {
                var found = tempDriverFromCaller.DriverEmail.FirstOrDefault(o => o.DriverEmailId == p.DriverEmailId);
                //if its not found then delete it from database
                if (found == null)
                {
                    repository.Delete(p);
                    await repository.SaveChanges();
                }
            }

            foreach(DriverInsurance insurance in curInsurance)
            {
                var found = tempDriverFromCaller.DriverInsurance.FirstOrDefault(x => x.DriverInsuranceId == insurance.DriverInsuranceId);

                if(found == null)
                {
                    repository.Delete(insurance);
                    await repository.SaveChanges();
                }
            }

            foreach (DriverMedicalHistory medicalHistory in curMedicalHistory)
            {
                var found = tempDriverFromCaller.DriverMedicalHistory.FirstOrDefault(x => x.DriverMedicalHistoryId == medicalHistory.DriverMedicalHistoryId);

                if (found == null)
                {
                    repository.Delete(medicalHistory);
                    await repository.SaveChanges();
                }
            }

            var currentDriver = await repository.GetDriverById(existingDriver.DriverId);

            return Ok(LoadDriver(currentDriver));
        }
        
    }
}