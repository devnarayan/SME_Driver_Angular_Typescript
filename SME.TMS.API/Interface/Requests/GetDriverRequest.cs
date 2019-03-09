using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class GetDriverRequest
    {
        public int DriverId { get; set; }
        public UserModel CurrentUser { get; set; }

        public GetDriverRequest()
        {
            DriverId = 0;
            CurrentUser = new UserModel();
        }

    }
}
