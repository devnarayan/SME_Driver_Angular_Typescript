using System;
using System.Collections.Generic;

namespace SME.TMS.API.Models
{
    public partial class Contract
    {
        public Contract()
        {
            DriverContract = new HashSet<DriverContract>();
            ContractTruck = new HashSet<ContractTruck>();
            ContractFinanceAgreement = new HashSet<ContractFinanceAgreement>();
        }

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
        public int CompanyId { get; set; }
        public decimal? InitialDeposit { get; set; }
        public decimal? PercentRetained { get; set; }

        public Company ReferencingCompany { get; set; }
        public ICollection<DriverContract> DriverContract { get; set; }
        public ICollection<ContractTruck> ContractTruck { get; set; }
        public ICollection<ContractFinanceAgreement> ContractFinanceAgreement { get; set; }
    }
}
