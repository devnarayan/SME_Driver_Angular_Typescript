using System;
using System.Collections.Generic;

namespace SME.TMS.API.Models
{
    public partial class DriverPhone
    {
        public int DriverPhoneId { get; set; }
        public string DriverPhoneNumber { get; set; }
        public int PhoneNumberTypeId { get; set; }
        public int DriverId { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public Driver Driver { get; set; }
        public PhoneNumberType PhoneNumberType { get; set; }
    }
}
