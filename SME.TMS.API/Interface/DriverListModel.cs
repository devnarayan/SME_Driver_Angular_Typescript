using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface
{
    public class DriverListModel
    {
        public int DriverId { get; set; }
        public string DriverFullName { get; set; }

        public DriverListModel()
        {
            DriverId = 0;
            DriverFullName = "";
        }
    }
}
