using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class GetLoanScheduleRequest
    {
        public int NumberOfPayments { get; set; }
        public decimal LoanAmount { get; set; }
        public decimal InterestRate { get; set; }
        public UserModel CurrentUser { get; set; }

        public int FrequencyTypeID { get; set; }
        public DateTime StartDate { get; set; }

        public GetLoanScheduleRequest()
        {
            NumberOfPayments = 0;
            LoanAmount = 0m;
            InterestRate = 0m;
            FrequencyTypeID = 0;
            StartDate = DateTime.MinValue;
            CurrentUser = new UserModel();
        }
    }
}
