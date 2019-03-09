using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class SaveCashReceiptRequest
    {
        public CashReceiptModel CurrentCashReceipt { get; set; }
        public UserModel CurrentUser { get; set; }

        public SaveCashReceiptRequest()
        {
            CurrentCashReceipt = new CashReceiptModel();
            CurrentUser = new UserModel();
        }
    }
}
