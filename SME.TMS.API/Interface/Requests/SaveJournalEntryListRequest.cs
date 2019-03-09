using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class SaveJournalEntryListRequest
    {
        public int JournalTypeId { get; set; }
        public List<JToken> JournalEntries { get; set; }
        public UserModel CurrentUser { get; set; }
    }
}
