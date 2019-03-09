using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface
{
    public class PeriodModel
    {
        public int PeriodId { get; set; }
        public int Year { get; set; }
        public string FrequencyTypeName { get; set; }
        public int FrequencyTypeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public bool IsDeleted { get; set; }
    }
}
