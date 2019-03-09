using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Models
{
    public partial class Truck
    {
        public int TruckId { get; set; }
        public string TruckNumber { get; set; }
        public string Notes { get; set; }
        public string SCAC { get; set; }
        public int CompanyId { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public Company ReferencingCompany { get; set; }
    }
}
