using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Responses
{
    public class GetExpenseTypeListResponse
    {
        public List<ExpenseTypeModel> ExpenseTypes { get; set; }
    }
}
