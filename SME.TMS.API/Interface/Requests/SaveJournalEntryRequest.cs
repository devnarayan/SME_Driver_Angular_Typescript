using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class SaveJournalEntryRequest
    {
        public int JournalTypeId { get; set; }
        public JToken JournalEntry { get; set; }
        public UserModel CurrentUser { get; set; }
    }

    public class SaveJournalImportRequest
    {
        public int JournalEntryId { get; set; }
        public JournalFileModel JournalEntry { get; set; }
        public UserModel CurrentUser { get; set; }
    }
    public class ExpenseMassImportRequest
    {
        public int TemplateDefinitionId { get; set; }
        public JournalFileModel JournalEntry { get; set; }
        public UserModel CurrentUser { get; set; }
    }
    public class SaveExpenseMassImportRequest
    {
        public int TemplateDefinitionId { get; set; }
        public List<ImportedExpenseModel> ExpenseModal { get; set; }
        public UserModel CurrentUser { get; set; }
    }
}
