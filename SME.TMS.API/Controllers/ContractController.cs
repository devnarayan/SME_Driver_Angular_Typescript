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
using SME.TMS.API.Interface.Requests;
using SME.TMS.API.Interface.Responses;

namespace SME.TMS.API.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    [EnableCors("CorsPolicyAllowAll")]
    public class ContractController : Controller
    {
        private readonly IConfiguration config;

        private readonly IDriverRepository repository;

        public ContractController(IDriverRepository repository, IConfiguration configuration)
        {
            config = configuration;
            this.repository = repository;
        }

        [HttpPost]
        [ActionName("GetLoanSchedule")]
        public async Task<IActionResult> GetLoanSchedule([FromBody]GetLoanScheduleRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            if(req.LoanAmount<= 0)
                throw new ArgumentException("Loan Amount needs to be greater than $0.00.");

            if (req.NumberOfPayments <= 0)
                throw new ArgumentException("Number of Payments needs to be greater than 0.");

            if (req.StartDate < new DateTime(2000,1,1))
                throw new ArgumentException("Start Date needs to be greater than 1/1/2000.");


            //*********************************************************************
            //TODO:MAKE THIS CALCULATION DATABASE DRIVEN SINCE NEEDED FOR REPORTING
            GetLoanScheduleResponse resp = new GetLoanScheduleResponse();
            List<LoanScheduleItem> items = new List<LoanScheduleItem>();
            //LoanScheduleItem item;
            DateTime _startDate = req.StartDate;
            Decimal _principal = req.LoanAmount;
            Decimal _interestRate = req.InterestRate;
            int _period = req.NumberOfPayments;


            // Make sure we use types that hold decimal places             
            //DateTime payDate = DateTime.ParseExact(_startDate.ToString(), "yyyyMMdd", null);
            DateTime payDate = _startDate;
            double interestRate = 0;
            double monthlyInterest = 0;
            double loanAmount;
            short amortizationTerm = 0;
            double currentBalance;
            double cummulativeInterest = 0;
            double monthlyPrincipal = 0;
            double cummulativePrincipal = 0;

            loanAmount = double.Parse(_principal.ToString());
            currentBalance = loanAmount;
            interestRate = double.Parse(_interestRate.ToString()) * 0.01;
            amortizationTerm = short.Parse(_period.ToString());

            // Calculate the monthly payment and round it to 2 decimal places           
            var monthlyPayment = ((interestRate / 12) / (1 - (Math.Pow((1 + (interestRate / 12)), -(amortizationTerm))))) * loanAmount;
            monthlyPayment = Math.Round(monthlyPayment, 2);

            // Storage List
            //List<AmortPayment> amortPaymentList = new List<AmortPayment>();

            // Loop for amortization term (number of monthly payments)
            for (int j = 0; j < amortizationTerm; j++)
            {
                // Calculate monthly cycle
                monthlyInterest = currentBalance * interestRate / 12;
                monthlyPrincipal = monthlyPayment - monthlyInterest;
                currentBalance = currentBalance - monthlyPrincipal;

                if (j == amortizationTerm - 1 && currentBalance != monthlyPayment)
                {
                    // Adjust the last payment to make sure the final balance is 0
                    monthlyPayment += currentBalance;
                    currentBalance = 0;
                }

                // Reset Date
                payDate = payDate.AddMonths(1);
                // Add to cummulative totals
                cummulativeInterest += monthlyInterest;
                cummulativePrincipal += monthlyPrincipal;

                items.Add(new LoanScheduleItem
                {
                    LoanScheduleItemID = j + 1,
                    PaymentNumber = j + 1,
                    PaymentDate = payDate,
                    PaymentAmount = Math.Round(Decimal.Parse(monthlyPayment.ToString()) + Decimal.Parse(monthlyInterest.ToString()), 2),
                    AppliedToInterest = Math.Round(Decimal.Parse(monthlyInterest.ToString()), 2),
                    AppliedToPrinciple = Math.Round(Decimal.Parse(monthlyPayment.ToString()), 2),
                    RemainingBalance = Math.Round(Decimal.Parse(currentBalance.ToString()), 2)
                });


            }


            resp.LoanScheduleItems = items;



            ////GetLoanScheduleResponse resp = new GetLoanScheduleResponse();
            ////List<LoanScheduleItem> items = new List<LoanScheduleItem>();
            ////LoanScheduleItem item;
            ////decimal paymentAmount = 0m;
            ////decimal runningBalance = 0m;
            ////int recCount = 0;
            ////bool isLastPayment = false;

            //////BI-MONTHLY FREQUENCY TYPE
            ////paymentAmount = req.LoanAmount / req.NumberOfPayments / 2;

            ////runningBalance = req.LoanAmount;

            ////MaintenanceController mc = new MaintenanceController(this.repository,config);
            ////List<PeriodModel> paymentPeriods = mc.BuildPeriodList(req.FrequencyTypeID, req.StartDate, req.StartDate.AddMonths(req.NumberOfPayments));
            ////foreach(PeriodModel pm in paymentPeriods)
            ////{
            ////    recCount++;

            ////    if (paymentAmount > runningBalance)
            ////        paymentAmount = runningBalance;

            ////    runningBalance = runningBalance - paymentAmount;

            ////    item = new LoanScheduleItem();
            ////    item.AppliedToPrinciple = paymentAmount;
            ////    item.AppliedToInterest = 0;
            ////    item.LoanScheduleItemID = recCount;
            ////    item.PaymentAmount = paymentAmount;
            ////    item.PaymentDate = pm.EndDate;
            ////    item.PaymentNumber = recCount;
            ////    item.RemainingBalance = runningBalance;

            ////    if(runningBalance<=0)
            ////    {
            ////        item.RemainingBalance = 0m;
            ////        isLastPayment = true;
            ////    }

            ////    items.Add(item);

            ////    if (isLastPayment)
            ////        break;
            ////}


            ////resp.LoanScheduleItems =items;

            return Ok(resp);
        }

        [HttpPost]
        [ActionName("GetContractLookups")]
        public async Task<IActionResult> GetContractLookups([FromBody]GetContractLookupsRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            GetContractLookupsResponse resp = new GetContractLookupsResponse();

            resp.FinanceTypes = await repository.GetAllFinanceTypes();
            var trucks = await repository.GetTrucksByCompanyId(user.CompanyId);
            foreach (Truck t in trucks)
            {
                resp.Trucks.Add(new TruckModel
                {
                    TruckId = t.TruckId,
                    TruckNumber = t.TruckNumber
                });
            }
            resp.LogoData = user.ReferencingCompany.Logo;

            return Ok(resp);
        }

        [HttpPost]
        [ActionName("GetContractList")]
        public async Task<IActionResult> GetContractList([FromBody]GetContractListRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            GetContractListResponse resp = new GetContractListResponse();

            var contracts = await repository.GetContractsByCompanyId(user.CompanyId);
            foreach (Contract c in contracts)
            {
                resp.ContractList.Add(new ContractListModel
                {
                    ContractId = c.ContractId,
                    ContractName = c.ContractName,
                    ContractNumber = c.ContractNumber
                });
            }

            return Ok(resp);
        }

        [HttpPost]
        [ActionName("GetContract")]
        public async Task<IActionResult> GetContract([FromBody]GetContractRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (req.ContractId == 0)
            {
                req.ContractId = 1;
            }

            repository.SetTimeout(120);

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            var contract = await repository.GetContractById(req.ContractId);

            if (contract == null)
            {
                return NotFound();
            }
            else if(contract.CompanyId != user.CompanyId)
            {
                return NotFound();
            }
            else
            {
                return Ok(LoadContract(contract));
            }
        }

        private async Task<GetContractResponse> LoadContract(Contract contract)
        {
            GetContractResponse resp = new GetContractResponse();

            ContractModel cm = new ContractModel()
            {
                CurrentPayPeriod = new DateTime(2017, 11, 3),
                AccountingContractId = contract.AccountingContractId,
                ContractEndDate = contract.ContractEndDate,
                ContractId = contract.ContractId,
                ContractName = contract.ContractName,
                ContractNumber = contract.ContractNumber,
                ContractStartDate = contract.ContractStartDate,
                InitialDeposit = contract.InitialDeposit,
                Is1099Vendor = contract.Is1099Vendor,
                IsDirectDeposit = contract.IsDirectDeposit,
                PayrollId = contract.PayrollId,
                PercentRetained = contract.PercentRetained,
                ResponsibleParty = contract.ResponsibleParty,
                TIN = contract.TIN,
                IsActive = contract.IsActive
            };

            resp.CurrentContract = cm;

            //setup the multiple rows of dataas well
            var drivers = await repository.GetDriverContractsByContractId(contract.ContractId);
            foreach (DriverContract dc in drivers)
            {
                resp.CurrentContract.AssignedDrivers.Add(new AssignedDriverModel
                {
                    DriverContractId = dc.DriverContractId,
                    DriverFullName = dc.Driver.FirstName + " " + dc.Driver.LastName,
                    DriverId = dc.DriverId,
                    EndDate = dc.EndDate,
                    StartDate = dc.StartDate
                });
            }

            var trucks = await repository.GetContractTrucksByContractId(contract.ContractId);
            foreach (ContractTruck ct in trucks)
            {
                resp.CurrentContract.AssignedTrucks.Add(new AssignedTruckModel
                {
                    ContractTruckId = ct.ContractTruckId,
                    TruckId = ct.TruckId,
                    TruckNumber = ct.Truck.TruckNumber,
                    EndDate = ct.EndDate,
                    StartDate = ct.StartDate
                });
            }


            var finances = await repository.GetContractFinanceAgreementsByContractId(contract.ContractId);
            //var finances = await _context.ContractFinanceAgreement.Where(dc => dc.ContractId == contract.ContractId).ToListAsync();
            foreach (ContractFinanceAgreement cfa in finances)
            {
                resp.CurrentContract.AssignedFinanceAgreements.Add(new AssignedFinanceAgreementModel
                {
                    ContractFinanceAgreementId = cfa.ContractFinanceAgreementId,
                    FinanceAgreementName = cfa.FinanceAgreementName,
                    FinanceTypeName = cfa.FinanceType.FinanceTypeName,
                    PaymentAmount = cfa.PaymentAmount,
                    RemainingBalance = cfa.RemainingBalance,
                    LoanAmount = cfa.LoanAmount,
                    EndDate = cfa.EndDate,
                    StartDate = cfa.StartDate
                });

                resp.CurrentContract.TotalLoans = resp.CurrentContract.TotalLoans + cfa.LoanAmount;
                resp.CurrentContract.TotalToSettle = resp.CurrentContract.TotalToSettle + cfa.RemainingBalance;
            }



            return resp;

        }

        [HttpPost]
        [ActionName("SaveContract")]
        public async Task<IActionResult> SaveContract([FromBody]SaveContractRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            repository.SetTimeout(120);

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            var existingContract = await repository.GetContractById(req.CurrentContract.ContractId);
            

            if (existingContract == null && req.CurrentContract.ContractId > 0)
                return NotFound();
            else if (existingContract == null)
            {
                existingContract = new Contract()
                {
                    CreatedBy = req.CurrentUser.UserName,
                    CreatedDate = DateTime.UtcNow,
                };
            }
            else if (existingContract.CompanyId != user.CompanyId)
                return NotFound();

            existingContract.AccountingContractId = req.CurrentContract.AccountingContractId;
            existingContract.ContractName = req.CurrentContract.ContractName;
            existingContract.ContractNumber = req.CurrentContract.ContractNumber;
            if (req.CurrentContract.ContractStartDate > DateTime.MinValue)
                existingContract.ContractStartDate = req.CurrentContract.ContractStartDate;
            if (req.CurrentContract.ContractEndDate > DateTime.MinValue)
                existingContract.ContractEndDate = req.CurrentContract.ContractEndDate;
            existingContract.ResponsibleParty = req.CurrentContract.ResponsibleParty;
            existingContract.TIN = req.CurrentContract.TIN;
            existingContract.PayrollId = req.CurrentContract.PayrollId;
            existingContract.IsDirectDeposit = req.CurrentContract.IsDirectDeposit;
            existingContract.Is1099Vendor = req.CurrentContract.Is1099Vendor;
            existingContract.InitialDeposit = req.CurrentContract.InitialDeposit;
            existingContract.PercentRetained = req.CurrentContract.PercentRetained;
            existingContract.CompanyId = user.CompanyId;
            existingContract.IsActive = req.CurrentContract.IsActive;
            existingContract.ModifiedBy = req.CurrentUser.UserName;
            existingContract.ModifiedDate = DateTime.UtcNow;

            // Determine if it is an insert. If not it will be an update.
            if (req.CurrentContract.ContractId == 0)
            {
                repository.Insert(existingContract);
            }

            await repository.SaveChanges();

            Contract temp = new Contract();
            List<DriverContract> driverContracts = await repository.GetDriverContractsByContractId(existingContract.ContractId);
            List<ContractTruck> contractTrucks = await repository.GetContractTrucksByContractId(existingContract.ContractId);
            List<ContractFinanceAgreement> contractFinanceAgreement = await repository.GetContractFinanceAgreementsByContractId(existingContract.ContractId);

            foreach (AssignedDriverModel driver in req.CurrentContract.AssignedDrivers)
            {
                DriverContract existingDriverContract = await repository.GetDriverContractById(driver.DriverContractId);

                if (existingDriverContract == null && driver.DriverContractId > 0)
                {
                    // Skip this record. no longer exists or wrong data.
                    continue;
                }
                else if(existingDriverContract == null)
                {
                    existingDriverContract = new DriverContract();
                    repository.Insert(existingDriverContract);
                }

                existingDriverContract.DriverId = driver.DriverId;
                existingDriverContract.ContractId = existingContract.ContractId;
                existingDriverContract.StartDate = driver.StartDate;
                existingDriverContract.EndDate = driver.EndDate;
                existingDriverContract.IsActive = true;

                if(driver.DriverContractId == 0)
                {
                    existingDriverContract.CreatedBy = req.CurrentUser.UserName;
                    existingDriverContract.CreatedDate = DateTime.UtcNow;
                }

                if (repository.IsChanged(existingDriverContract))
                {
                    existingDriverContract.ModifiedBy = req.CurrentUser.UserName;
                    existingDriverContract.ModifiedDate = DateTime.UtcNow;
                }

                driverContracts.RemoveAll(x => x.DriverContractId == existingDriverContract.DriverContractId);

                temp.DriverContract.Add(existingDriverContract);
            }

            foreach (AssignedTruckModel truck in req.CurrentContract.AssignedTrucks)
            {
                ContractTruck exisingContractTruck = await repository.GetContractTruckById(truck.ContractTruckId);

                if (exisingContractTruck == null && truck.ContractTruckId > 0)
                {
                    // Skip this record. no longer exists or wrong data.
                    continue;
                }
                else if (exisingContractTruck == null)
                {
                    exisingContractTruck = new ContractTruck();
                    repository.Insert(exisingContractTruck);
                }

                exisingContractTruck.TruckId = truck.TruckId;
                exisingContractTruck.ContractId = existingContract.ContractId;
                exisingContractTruck.StartDate = truck.StartDate;
                exisingContractTruck.EndDate = truck.EndDate;
                exisingContractTruck.IsActive = true;

                if (truck.ContractTruckId == 0)
                {
                    exisingContractTruck.CreatedBy = req.CurrentUser.UserName;
                    exisingContractTruck.CreatedDate = DateTime.UtcNow;
                }

                if (repository.IsChanged(exisingContractTruck))
                {
                    exisingContractTruck.ModifiedBy = req.CurrentUser.UserName;
                    exisingContractTruck.ModifiedDate = DateTime.UtcNow;
                }

                contractTrucks.RemoveAll(x => x.ContractTruckId == exisingContractTruck.ContractTruckId);

                temp.ContractTruck.Add(exisingContractTruck);
            }

            foreach (AssignedFinanceAgreementModel financialAgreement in req.CurrentContract.AssignedFinanceAgreements)
            {
                ContractFinanceAgreement existingFinancialAgreement = await repository.GetContractFinanceAgreementById(financialAgreement.ContractFinanceAgreementId);

                if (existingFinancialAgreement == null && financialAgreement.ContractFinanceAgreementId > 0)
                {
                    // Skip this record. no longer exists or wrong data.
                    continue;
                }
                else if (existingFinancialAgreement == null)
                {
                    existingFinancialAgreement = new ContractFinanceAgreement();
                    existingFinancialAgreement.CompanyId = user.CompanyId;
                    repository.Insert(existingFinancialAgreement);
                }

                existingFinancialAgreement.ContractId = existingContract.ContractId;
                existingFinancialAgreement.IsActive = true;

                if (financialAgreement.ContractFinanceAgreementId == 0)
                {
                    existingFinancialAgreement.CreatedBy = req.CurrentUser.UserName;
                    existingFinancialAgreement.CreatedDate = DateTime.UtcNow;
                }

                if (repository.IsChanged(existingFinancialAgreement))
                {
                    existingFinancialAgreement.ModifiedBy = req.CurrentUser.UserName;
                    existingFinancialAgreement.ModifiedDate = DateTime.UtcNow;
                }

                existingFinancialAgreement.StartDate = financialAgreement.StartDate;
                existingFinancialAgreement.EndDate = (financialAgreement.EndDate ?? DateTime.MinValue);
                existingFinancialAgreement.PaymentAmount = financialAgreement.PaymentAmount;
                existingFinancialAgreement.FinanceAgreementName = financialAgreement.FinanceAgreementName;
                existingFinancialAgreement.LoanAmount = financialAgreement.LoanAmount;
                existingFinancialAgreement.RemainingBalance = financialAgreement.RemainingBalance;
                var typeQuery = await repository.GetFinanceTypeByName(financialAgreement.FinanceTypeName);
                if (typeQuery == null)
                    return NotFound();

                existingFinancialAgreement.FinanceTypeId = typeQuery.FinanceTypeId;

                contractFinanceAgreement.RemoveAll(x => x.ContractFinanceAgreementId == existingFinancialAgreement.ContractFinanceAgreementId);

                temp.ContractFinanceAgreement.Add(existingFinancialAgreement);
            }

            // Delete any unincluded elements in the collection.
            foreach (DriverContract driver in driverContracts)
                repository.Delete(driver);
            foreach (ContractTruck truck in contractTrucks)
                repository.Delete(truck);
            foreach (ContractFinanceAgreement financialAgreement in contractFinanceAgreement)
                repository.Delete(financialAgreement);

            existingContract.DriverContract = temp.DriverContract;
            existingContract.ContractTruck = temp.ContractTruck;
            existingContract.ContractFinanceAgreement = temp.ContractFinanceAgreement;

            repository.Ignore(existingContract);
            await repository.SaveChanges();

            return Ok(LoadContract(existingContract));
        }
    }
}