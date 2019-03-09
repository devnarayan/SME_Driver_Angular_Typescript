using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Responses
{
    public class GetPeriodListResponse
    {
        public List<PeriodModel> Periods { get; set; }
    }
}
