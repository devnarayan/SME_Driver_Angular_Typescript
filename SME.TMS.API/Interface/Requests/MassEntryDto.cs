using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class MassEntryDto
    {
    }
    public class GetTemplateDefinitionRequest
    {
        public int? VendorId { get; set; }
        public UserModel CurrentUser { get; set; }
    }
}
