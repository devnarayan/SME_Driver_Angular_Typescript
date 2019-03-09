using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Models
{
    public class TransactionStatusType
    {
        public int TransactionStatusTypeId {get;set;}
        public string TransactionStatusTypeName { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get;set; }
        public string CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

        public enum Enum
        {
            Open = 2,
            Close = 3,
            Acknowledge = 4,
            Reconciled = 5,
            Void = 6
        }
    }
}
