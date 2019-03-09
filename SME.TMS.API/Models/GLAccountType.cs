using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Models
{
    public class GLAccountType
    {
        public int GLAccountTypeID { get; set; }
        public string GLAccountTypeName { get; set; }

        public enum Enum
        {
            SME = 1,
            Driver = 2
        }
    }
}
