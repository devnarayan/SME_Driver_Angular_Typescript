using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface
{
    public class ExpenseTypeModel
    {
        public int ExpenseTypeID { get; set; }
        public string ExpenseTypeName { get; set; }
        public string ExpenseTypeDesc { get; set; }
        public int FrequencyTypeId { get; set; }
        public string FrequencyTypeName { get; set; }
        public string AutomationCode { get; set; }
        public decimal DriverPercent { get; set; }
        public decimal CompanyPercent { get; set; }
        public string DriverGLAccount { get; set; }
        public string CompanyGLAccount { get; set; }
    }
}
