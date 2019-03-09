using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Models
{
    public class Expense
    {
        public int ExpenseID { get; set; }
        public int RevisionNo { get; set; }
        public int SettlementCycleID { get; set; }
        public int RecordSourceTypeID { get; set; }
        public string SourceKey { get; set; }
        public int RecordType { get; set; }
        public int OwnerID { get; set; }
        public int VendorID { get; set; }
        public string DriverGLAccount { get; set; }
        public string SMEGLAccount { get; set; }
        public int ExpenseType { get; set; }
        public int FrequencyID { get; set; }
        public string AccountNo { get; set; }
        public decimal TransactionAmount { get; set; }
        public DateTime TransactionDate { get; set; }
        public string DocumentNo { get; set; }
        public string TruckNumber { get; set; }
        public int? DriverID { get; set; }
        public int? Odometer { get; set; }
        public string LocationName { get; set; }
        public string City { get; set; }
        public string StateProv { get; set; }
        public decimal Fees { get; set; }
        public string ItemDescription { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal Quantity { get; set; }
        public string AdditionalContent { get; set; }
        public DateTime ApprovalDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }

    }
}
