using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Responses
{
    public class GetContractListResponse
    {
        public List<ContractListModel> ContractList { get; set; }

        public GetContractListResponse()
        {
            ContractList = new List<ContractListModel>();
        }
    }
}
