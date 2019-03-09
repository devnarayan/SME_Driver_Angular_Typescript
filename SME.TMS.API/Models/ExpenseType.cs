using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Models
{
    public class ExpenseType
    {
        [Key]
        public int ExpenseTypeID { get; set; }
        public string ExpenseTypeName { get; set; }
        public string ExpenseTypeDesc { get; set; }
        public int FrequencyTypeId { get; set; }
        public string AutomationCode { get; set; }
        public decimal DriverPercent { get; set; }
        public decimal CompanyPercent { get; set; }
        public string DriverGLAccount { get; set; }
        public string SMEGLAccount { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

        public FrequencyType FrequencyType { get; set; }
    }
}
