using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Responses
{
    public class GetAllGLAccountsResponse
    {
        public List<string> DriverAccounts { get; set; }
        public List<string> CompanyAccounts { get; set; }
    }
}
