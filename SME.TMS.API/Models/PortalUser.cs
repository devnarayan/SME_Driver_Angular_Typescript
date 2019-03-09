using System;
using System.Collections.Generic;

namespace SME.TMS.API.Models
{
    public partial class PortalUser
    {
        public PortalUser()
        {
            PortalUserManufacturer = new HashSet<PortalUserManufacturer>();
        }

        public int PortalUserId { get; set; }
        public string PortalUsername { get; set; }
        public string PortalPassword { get; set; }
        public string Salt { get; set; }
        public string CompanyName { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public int? DefaultDealerId { get; set; }
        public int? PortalUserTypeId { get; set; }
        public bool? IsPasswordRequiredToChange { get; set; }
        public int? UserProfileId { get; set; }
        public DateTime? LastLogin { get; set; }
        public string DealerNumber { get; set; }
        public string PasswordResetCode { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int CompanyId { get; set; }

        public Company ReferencingCompany { get; set; }
        public PortalUserType PortalUserType { get; set; }
        public ICollection<PortalUserManufacturer> PortalUserManufacturer { get; set; }
    }
}
