using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class SavePeriodListRequest
    {
        public List<PeriodModel> Periods { get; set; }
        public UserModel CurrentUser { get; set; }
        public bool IsBuild { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int FrequencyTypeId { get; set; }
    }
}
