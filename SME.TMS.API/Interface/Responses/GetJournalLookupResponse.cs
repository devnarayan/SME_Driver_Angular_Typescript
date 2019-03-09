using SME.TMS.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Responses
{
    public class GetJournalLookupResponse
    {
        public List<JournalType> JournalTypes { get; set; }
        public List<MaintenanceType> MaintenanceTypes { get; set; }
        public List<FrequencyType> FrequencyTypes { get; set; }
        public string LogoData { get; set; }
    }
}
