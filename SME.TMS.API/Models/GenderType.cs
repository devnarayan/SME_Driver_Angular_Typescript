using System;
using System.Collections.Generic;

namespace SME.TMS.API.Models
{
    public partial class GenderType
    {
        public GenderType()
        {
            Driver = new HashSet<Driver>();
        }

        public int GenderTypeId { get; set; }
        public string GenderTypeAbbrev { get; set; }
        public string GenderTypeName { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public ICollection<Driver> Driver { get; set; }
    }
}
