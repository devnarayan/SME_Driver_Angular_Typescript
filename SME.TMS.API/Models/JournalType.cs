using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Models
{
    public class JournalType
    {
        public int JournalTypeId { get; set; }
        public string JournalTypeName { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        
        public enum Enum
        {
            Expenses = 1,
            Recurring = 2,
            MaintenanceParts = 3,
            Compliance = 4,
            Adjustment = 5
        }
    }
}
