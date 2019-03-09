using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Responses
{
    public class GetContractResponse
    {
        public ContractModel CurrentContract { get; set; }

        public GetContractResponse()
        {
            CurrentContract = new ContractModel();
        }
    }
}
