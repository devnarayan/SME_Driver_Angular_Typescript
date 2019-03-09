using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class GetContractRequest
    {
        public int ContractId { get; set; }
        public UserModel CurrentUser { get; set; }

        public GetContractRequest()
        {
            ContractId = 0;
            CurrentUser = new UserModel();
        }

    }
}
