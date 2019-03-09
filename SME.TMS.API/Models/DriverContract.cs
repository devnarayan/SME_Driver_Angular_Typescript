using System;
using System.Collections.Generic;

namespace SME.TMS.API.Models
{
    public partial class DriverContract
    {
        public int DriverContractId { get; set; }
        public int DriverId { get; set; }
        public int ContractId { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public Contract Contract { get; set; }
        public Driver Driver { get; set; }
    }
}
