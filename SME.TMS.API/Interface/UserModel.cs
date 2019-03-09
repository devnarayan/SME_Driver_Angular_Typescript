using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface
{
    public class UserModel
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public int PortalUserTypeId { get; set; }
        public string PrimaryAssociation { get; set; }
        public string UserToken { get; set; }

        public List<DealerEmail> DealerEmails { get; set; }
        public List<AssignedCenter> AssignedCenters { get; set; }
    }

    public class DealerEmail
    {
        public int DealerId { get; set; }
        public string DealerName { get; set; }
        public string DealerNumber { get; set; }
        public string DealerEmailList { get; set; }
        public string EmailToAdd { get; set; }



    }

    public class AssignedCenter
    {
        public int CenterId { get; set; }
        public string CenterName { get; set; }
    }
}
