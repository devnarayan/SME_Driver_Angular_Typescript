using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Responses
{
    public class GetLoanScheduleResponse
    {
        public List<LoanScheduleItem> LoanScheduleItems { get; set; }

        public GetLoanScheduleResponse()
        {
            LoanScheduleItems = new List<LoanScheduleItem>();
        }

    }


    public class LoanScheduleItem
    {
        public int LoanScheduleItemID { get; set; }
        public int PaymentNumber { get; set; }

        public DateTime PaymentDate { get; set; }
        public decimal PaymentAmount { get; set; }
        public decimal AppliedToInterest { get; set; }
        public decimal AppliedToPrinciple { get; set; }
        public decimal RemainingBalance { get; set; }


        public LoanScheduleItem()
        {
            LoanScheduleItemID = 0;
            PaymentNumber = 0;
            PaymentDate = DateTime.MinValue;
            PaymentAmount = 0m;
            AppliedToInterest = 0m;
            AppliedToPrinciple = 0m;
            RemainingBalance = 0m;
        }
    }
}
