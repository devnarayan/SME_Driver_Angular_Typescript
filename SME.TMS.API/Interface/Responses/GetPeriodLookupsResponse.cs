using SME.TMS.API.Models;
using System.Collections.Generic;

namespace SME.TMS.API.Interface.Responses
{
    public class GetPeriodLookupsResponse
    {
        public List<FrequencyType> FrequencyTypes { get; set; }
    }
}
