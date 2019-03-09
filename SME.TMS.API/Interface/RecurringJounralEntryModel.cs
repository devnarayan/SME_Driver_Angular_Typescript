using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface
{
    public class RecurringJounralEntryModel : JournalEntryModel
    {
        public int FrequencyTypeId { get; set; }
        public string FrequencyName { get; set; }
        public DateTime LoanDate { get; set; }
        public decimal CycleDue { get; set; }
        public decimal InterestRate { get;set; }
        public int Settlements { get; set; }
    }
}
