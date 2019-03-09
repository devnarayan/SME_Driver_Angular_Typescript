using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class GetDriverLookupsRequest
    {
        public UserModel CurrentUser { get; set; }

        public GetDriverLookupsRequest()
        {
            CurrentUser = new UserModel();
        }
    }
}
