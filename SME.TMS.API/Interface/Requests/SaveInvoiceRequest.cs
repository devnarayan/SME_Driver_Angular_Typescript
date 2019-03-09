using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class SaveInvoiceRequest
    {
        public InvoiceModel CurrentInvoice { get; set; }
        public UserModel CurrentUser { get; set; }

        public SaveInvoiceRequest()
        {
            CurrentInvoice = new InvoiceModel();
            CurrentUser = new UserModel();
        }
    }
}
