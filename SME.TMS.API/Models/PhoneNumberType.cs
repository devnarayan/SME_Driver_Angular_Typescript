using System;
using System.Collections.Generic;

namespace SME.TMS.API.Models
{
    public partial class PhoneNumberType
    {
        public PhoneNumberType()
        {
            DriverPhone = new HashSet<DriverPhone>();
        }

        public int PhoneNumberTypeId { get; set; }
        public string PhoneNumberTypeName { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public ICollection<DriverPhone> DriverPhone { get; set; }
    }
}
