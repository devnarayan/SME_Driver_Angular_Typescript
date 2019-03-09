using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Models
{
    public class JournalMaintenanceExtension
    {
        [Key]
        public int JournalEntryId { get; set; }
        public int MaintenanceTypeId { get; set; }
        public DateTime TransactionDate { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public MaintenanceType MaintenanceType { get; set; }
        public JournalEntry JournalEntry { get; set; }
    }
}
