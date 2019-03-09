using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class GetCashReceiptListRequest
    {
        public int? VendorId { get; set; }
        public UserModel CurrentUser { get; set; }
    }
}
