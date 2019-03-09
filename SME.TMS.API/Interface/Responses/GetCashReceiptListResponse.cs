using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Responses
{
    public class GetCashReceiptListResponse
    {
        public List<CashReceiptModel> CashReceipts { get; set; }
        public int TotalVendors { get; set; }
        public decimal TotalOutstandingBalance { get; set; }
        public decimal CompletionPercentage { get; set; }

        public GetCashReceiptListResponse()
        {
            CashReceipts = new List<CashReceiptModel>();
            TotalVendors = 0;
            TotalOutstandingBalance = 0m;
        }
    }
}
