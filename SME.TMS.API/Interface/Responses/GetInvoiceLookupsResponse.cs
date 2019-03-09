using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Responses
{
    public class GetInvoiceLookupsResponse
    {
        public List<VendorModel> Vendors { get; set; }
        public string LogoData { get; set; }



        public GetInvoiceLookupsResponse()
        {
            Vendors = new List<VendorModel>();
        }
    }
}
