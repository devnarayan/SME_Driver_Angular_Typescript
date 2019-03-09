using System;
using System.Collections.Generic;

namespace SME.TMS.API.Models
{
    public partial class PortalUserDealer
    {
        public int PortalUserDealerId { get; set; }
        public int PortalUserId { get; set; }
        public int DealerId { get; set; }
    }
}
