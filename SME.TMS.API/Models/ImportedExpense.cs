using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Models
{
    public class ImportedExpense
    {
        public int ImportedExpenseId { get; set; }
        public Nullable<int> TemplateDefinitionId { get; set; }
        public Nullable<int> DriverId { get; set; }
        public Nullable<int> ContractId { get; set; }
        public Nullable<int> TruckId { get; set; }
        public Nullable<System.DateTime> TransactionDate { get; set; }
        public string TransactionDesc { get; set; }
        public string TransactionNumber { get; set; }
        public Nullable<decimal> DriverAmount { get; set; }
        public Nullable<decimal> SMEAmount { get; set; }
        public bool IsOpen { get; set; }
        public System.DateTime ImportDate { get; set; }
        public string ImportByUser { get; set; }

        public TemplateDefinition TemplateDefinition { get; set; }
    }

}
