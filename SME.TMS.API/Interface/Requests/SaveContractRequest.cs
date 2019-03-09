using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class SaveContractRequest
    {
        public SaveContractRequest(ContractModel contract, UserModel currentUser)
        {
            CurrentContract = contract;
            CurrentUser = currentUser;
        }

        public ContractModel CurrentContract { get; set; }
        public UserModel CurrentUser { get; set; }
    }
}
