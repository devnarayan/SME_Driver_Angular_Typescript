using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SME.Dispatch.Business.BusinessObjects
{
    public class Inspection 
    {
        public int InspectionId { get; set; }
        public string InspectionTypeName { get; set; }
        public string DamageAreaName { get; set; }
        public string DamageCodeName { get; set; }
        public string DamageTypeName { get; set; }
        public DateTime InspectionDate { get; set; }
        public string InspectionDesc { get; set; }
        public int DamageAreaId { get; set; }
        public int DamageCodeId { get; set; }
        public int DamageTypeId { get; set; }
        public string Vin { get; set; }
        public int Sequence { get; set; }
        public int CenterId { get; set; }
        public int VehicleId { get; set; }
        public string DealerNumber { get; set; }
        
        public Inspection()
        {
            InspectionId = int.MinValue;
            InspectionTypeName = string.Empty;
            DamageAreaName = string.Empty;
            DamageCodeName = string.Empty;
            DamageTypeName = string.Empty;
            InspectionDate = DateTime.MinValue;
            InspectionDesc = "";
            DamageAreaId = 0;
            DamageCodeId = 0;
            DamageTypeId = 0;
            Vin = "";
            Sequence = 0;
            CenterId = 0;
            VehicleId = 0;
            DealerNumber = "";
        }
    }
}
