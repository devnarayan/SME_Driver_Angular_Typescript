using System;
using System.Collections.Generic;

namespace SME.TMS.API.Models
{
    public partial class PortalUserType
    {
        public PortalUserType()
        {
            PortalUser = new HashSet<PortalUser>();
        }

        public int PortalUserTypeId { get; set; }
        public string PortalUserTypeName { get; set; }

        public ICollection<PortalUser> PortalUser { get; set; }
    }
}
