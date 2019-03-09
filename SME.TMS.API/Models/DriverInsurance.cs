using System;
using System.Collections.Generic;

namespace SME.TMS.API.Models
{
    public partial class DriverInsurance
    {
        public int DriverInsuranceId { get; set; }
        public int DriverId { get; set; }
        public int InsuranceProviderId { get; set; }
        public decimal InsuranceRate { get; set; }
        public DateTime InsuranceEffectiveDate { get; set; }
        public DateTime? InsuranceEndDate { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public Driver Driver { get; set; }
        public InsuranceProvider InsuranceProvider { get; set; }
    }
}
