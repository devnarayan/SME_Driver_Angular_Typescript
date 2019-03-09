using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SME.TMS.API.Models;

namespace SME.TMS.API.Interface.Responses
{
    public class GetCashReceiptLookupsResponse
    {
        public List<VendorModel> Vendors { get; set; }
        public string LogoData { get; set; }



        public GetCashReceiptLookupsResponse()
        {
            Vendors = new List<VendorModel>();
        }
    }
}
