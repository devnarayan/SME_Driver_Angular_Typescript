using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class GetContractLookupsRequest
    {
        public UserModel CurrentUser { get; set; }

        public GetContractLookupsRequest()
        {
            CurrentUser = new UserModel();
        }
    }
}
