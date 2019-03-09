using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Models
{
    public class JournalRecurringExtension
    {
        [Key]
        public int JournalEntryId { get; set; }
        public int FrequencyTypeId { get; set; }
        public DateTime LoanDate { get; set; }
        public decimal? CycleDue { get; set; }
        public decimal InterestRate { get; set; }
        public int Settlements { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public JournalEntry JournalEntry { get; set; }
        public FrequencyType FrequencyType { get; set; }
    }
}
