using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface
{
    public class SettledTransactionModel
    {
        public int SettledTransactionId { get; set; }
        public DateTime SettledDate { get; set; }
        public string PaymentNumber { get; set; }
        public decimal TransactionAmount { get; set; }
        public string TransactionDesc { get; set; }

        public SettledTransactionModel()
        {
            SettledTransactionId = 0;
            SettledDate = new DateTime(1900, 1, 1);
            PaymentNumber = "";
            TransactionAmount = 0m;
            TransactionDesc = "";
        }

    }
}
