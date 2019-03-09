using System;
using System.Collections.Generic;

namespace SME.TMS.API.Models
{
    public partial class InsuranceProvider
    {
        public InsuranceProvider()
        {
            DriverInsurance = new HashSet<DriverInsurance>();
        }

        public int InsuranceProviderId { get; set; }
        public string InsuranceProviderName { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public ICollection<DriverInsurance> DriverInsurance { get; set; }
    }
}
