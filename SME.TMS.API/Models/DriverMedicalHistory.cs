using System;
using System.Collections.Generic;

namespace SME.TMS.API.Models
{
    public partial class DriverMedicalHistory
    {
        public int DriverMedicalHistoryId { get; set; }
        public int DriverId { get; set; }
        public int MedicalProviderId { get; set; }
        public decimal MedicalExamRate { get; set; }
        public DateTime MedicalExamEffectiveDate { get; set; }
        public DateTime MedicalExamExpirationDate { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public Driver Driver { get; set; }
        public MedicalProvider MedicalProvider { get; set; }
    }
}
