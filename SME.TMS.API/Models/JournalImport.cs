using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Models
{
    public  class JournalImport
    {
        public System.Guid JournalImportId { get; set; }
        public int JournalEntryID { get; set; }
        public string DocTitle { get; set; }
        public byte[] FileData { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string ContentType { get; set; }
        public string FileName { get; set; }
    }
}
