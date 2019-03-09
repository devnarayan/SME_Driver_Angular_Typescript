using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Models
{
    public class TemplateDefinition
    {
        public TemplateDefinition()
        {
            ImportedExpenses = new HashSet<ImportedExpense>();
        }
        public int TemplateDefinitionId { get; set; }
        public string TemplateDefinitionName { get; set; }
        public string TemplateDefinitionDesc { get; set; }
        public string TemplateDefinitionSchema { get; set; }
        public Nullable<int> VendorId { get; set; }

        public ICollection<ImportedExpense> ImportedExpenses { get; set; }
    }
}
