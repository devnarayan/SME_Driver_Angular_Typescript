using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface
{
    public class MaintenanceJournalEntryModel : JournalEntryModel
    {
        public int MaintenanceTypeId { get; set; }
        public string MaintenanceTypeName { get; set; }
        public DateTime TransactionDate { get; set; }
    }
}
