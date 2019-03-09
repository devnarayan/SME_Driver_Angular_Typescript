using System;
using System.Collections.Generic;

namespace SME.TMS.API.Models
{
    public partial class StateProvince
    {
        public StateProvince()
        {
            Driver = new HashSet<Driver>();
        }

        public int StateProvinceId { get; set; }
        public string StateProvinceName { get; set; }
        public string StateProvinceAbbreviation { get; set; }
        public int? CountryId { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public ICollection<Driver> Driver { get; set; }
    }
}
