using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Models
{
    public class JournalEntry
    {
        public int JournalEntryId { get; set; }
        public string JournalEntryName { get; set; }
        public int JournalTypeId { get; set; }
        public int DriverId { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string DriverGLAccount { get; set; }
        public string SMEGLAccount { get; set; }
        public int CompanyId { get; set; }
        public int ContractId { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public Company ReferencingCompany { get; set; }
        public Driver Driver { get; set; }
        public JournalType JournalType { get; set; }
        public JournalMaintenanceExtension MaintenanceExtension { get; set; }
        public JournalRecurringExtension RecurringExtension { get; set; }
        public Contract Contract { get; set; }
    }
}
