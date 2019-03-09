using System;
using System.Collections.Generic;

namespace SME.TMS.API.Models
{
    public partial class MedicalProvider
    {
        public MedicalProvider()
        {
            DriverMedicalHistory = new HashSet<DriverMedicalHistory>();
        }

        public int MedicalProviderId { get; set; }
        public string MedicalProviderName { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public ICollection<DriverMedicalHistory> DriverMedicalHistory { get; set; }
    }
}
