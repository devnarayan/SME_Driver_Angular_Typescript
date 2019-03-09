using SME.TMS.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Responses
{
    public class GetContractLookupsResponse
    {
        public List<FinanceType> FinanceTypes { get; set; }
        public List<TruckModel> Trucks { get; set; }
        public string LogoData { get; set; }


        public GetContractLookupsResponse()
        {
            FinanceTypes = new List<FinanceType>();
            Trucks = new List<TruckModel>();
        }
    }
}
