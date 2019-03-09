using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface
{
    public class ContractModel
    {
        public int ContractId { get; set; }
        public int? AccountingContractId { get; set; }
        public string ContractName { get; set; }
        public string ContractNumber { get; set; }
        public DateTime ContractStartDate { get; set; }
        public DateTime? ContractEndDate { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string ResponsibleParty { get; set; }
        public string TIN { get; set; }
        public string PayrollId { get; set; }
        public bool? IsDirectDeposit { get; set; }
        public bool? Is1099Vendor { get; set; }
        public decimal? InitialDeposit { get; set; }
        public decimal? PercentRetained { get; set; }
        public DateTime CurrentPayPeriod { get; set; }
        public decimal TotalLoans { get; set; }
        public decimal TotalToSettle { get; set; }
        public List<AssignedDriverModel> AssignedDrivers { get; set; }
        public List<AssignedTruckModel> AssignedTrucks { get; set; }

        public List<AssignedFinanceAgreementModel> AssignedFinanceAgreements { get; set; }

        public ContractModel()
        {
            ContractId = 0;
            AccountingContractId = null;
            ContractName = "";
            ContractNumber = "";
            ContractStartDate = DateTime.Now;
            ContractEndDate = null;
            IsActive = false;
            ResponsibleParty = "";
            TIN = "";
            PayrollId = "";
            IsDirectDeposit = false;
            Is1099Vendor = false;
            InitialDeposit = 0;
            PercentRetained = 0;
            CurrentPayPeriod = DateTime.Now;
            TotalLoans = 0;
            TotalToSettle = 0;
            AssignedDrivers = new List<AssignedDriverModel>();
            AssignedTrucks = new List<AssignedTruckModel>();
            AssignedFinanceAgreements = new List<AssignedFinanceAgreementModel>();
        }
    }

    public class AssignedDriverModel
    {
        public int DriverContractId { get; set; }
        public int DriverId { get; set; }
        public string DriverFullName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public AssignedDriverModel()
        {
            DriverId = 0;
            DriverFullName = "";
            StartDate = DateTime.Now;
            EndDate = null;
        }
    }

    public class AssignedTruckModel
    {
        public int ContractTruckId { get; set; }
        public int TruckId { get; set; }
        public string TruckNumber { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public AssignedTruckModel()
        {
            TruckId = 0;
            TruckNumber = "";
            StartDate = DateTime.Now;
            EndDate = null;
        }
    }

    public class AssignedFinanceAgreementModel
    {
        public int ContractFinanceAgreementId { get; set; }
        public string FinanceTypeName { get; set; }
        public string FinanceAgreementName { get; set; }
        public decimal PaymentAmount { get; set; }
        public decimal LoanAmount { get; set; }
        public decimal RemainingBalance { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public AssignedFinanceAgreementModel()
        {
            FinanceAgreementName = "";
            FinanceTypeName = "";
            PaymentAmount = 0;
            StartDate = DateTime.Now;
            EndDate = null;
        }
    }

}
