using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface.Requests
{
    public class GetJournalListRequest
    {
        public int JournalTypeId { get;set; }
        public int DriverId { get; set; }
        public int ContractId { get; set; }
        public UserModel CurrentUser { get; set; }
        public int JournalEntryId { get; set; }

    }
    public class GetJournalImportRequest
    {
        public System.Guid JournalImportId { get; set; }
        public UserModel CurrentUser { get; set; }
        public int? JournalEntryId { get; set; }
    }
}
