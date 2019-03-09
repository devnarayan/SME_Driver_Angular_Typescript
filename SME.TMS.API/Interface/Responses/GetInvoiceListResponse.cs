using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Responses
{
    public class GetInvoiceListResponse
    {
        public List<InvoiceModel> Invoices { get; set; }
        public int TotalVendors { get; set; }
        public decimal TotalOutstandingBalance { get; set; }
        public decimal CompletionPercentage { get; set; }

        public GetInvoiceListResponse()
        {
            Invoices = new List<InvoiceModel>();
            TotalVendors = 0;
            TotalOutstandingBalance = 0m;
        }
    }
}
