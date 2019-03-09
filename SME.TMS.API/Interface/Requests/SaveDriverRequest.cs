using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class SaveDriverRequest
    {
        public UserModel CurrentUser { get; set; }
        public DriverModel CurrentDriver { get; set; }

        public SaveDriverRequest()
        {
            CurrentUser = new UserModel();
            CurrentDriver = new DriverModel();
        }
    }
}
