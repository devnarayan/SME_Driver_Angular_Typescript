using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Models
{
    public partial class ContractTruck
    {
        public int ContractTruckId { get; set; }
        public int ContractId { get; set; }

        public int TruckId { get; set; }

        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public Contract Contract { get; set; }
        public Truck Truck { get; set; }
    }
}
