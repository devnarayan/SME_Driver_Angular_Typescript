using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class SaveExpenseTypeListRequest
    {
        public List<ExpenseTypeModel> ExpenseTypes { get; set; }
        public UserModel CurrentUser { get; set; }
    }
}
