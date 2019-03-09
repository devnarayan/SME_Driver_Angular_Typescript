using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Responses
{
    public class GetJournalListResposne
    {
        public List<JournalEntryModel> JournalEntries { get; set; }
        public JournalEntryModel CurrentJournalEntry { get; set; }
    }

    public class GetJournalImportResponse
    {
        public List<JournalImportModel> Result { get; set; }
    }
    public class GetTemplateDefiResponse
    {
        public List<TemplateDefinitionModel> Result { get; set; }
    }
}
