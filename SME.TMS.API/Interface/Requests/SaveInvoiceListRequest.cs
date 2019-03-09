using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class SaveInvoiceListRequest
    {
        public List<InvoiceModel> Invoices { get; set; }
        public UserModel CurrentUser { get; set; }
    }
}
