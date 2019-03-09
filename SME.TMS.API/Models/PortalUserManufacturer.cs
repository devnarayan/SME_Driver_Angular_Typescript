using System;
using System.Collections.Generic;

namespace SME.TMS.API.Models
{
    public partial class PortalUserManufacturer
    {
        public int PortalUserManufacturerId { get; set; }
        public int PortalUserId { get; set; }
        public int ManufacturerTypeId { get; set; }

        public PortalUser PortalUser { get; set; }
    }
}
