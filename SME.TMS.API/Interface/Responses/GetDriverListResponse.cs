using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Responses
{
    public class GetDriverListResponse
    {
        public List<DriverListModel> DriverList { get; set; }

        public GetDriverListResponse()
        {
            DriverList = new List<DriverListModel>();
        }
    }
}
