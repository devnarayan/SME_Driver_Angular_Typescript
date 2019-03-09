using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface
{
    public class ContractListModel
    {
        public int ContractId { get; set; }
        public string ContractName { get; set; }
        public string ContractNumber { get; set; }

        public ContractListModel()
        {
            ContractId = 0;
            ContractName = "";
            ContractNumber = "";
        }
    }
}
