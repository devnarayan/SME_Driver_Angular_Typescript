using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface
{
    public class InvoiceModel
    {
        public int InvoiceId { get; set; }
        public string TrackingIdNumber { get; set; }
        public int DispatchLoadNumber { get; set; }
        public decimal? DriverRate { get; set; }
        public decimal? DriverFuelSurcharge { get; set; }
        public int VendorId { get; set; }
        public decimal ManufacturerRate { get; set; }
        public decimal ManufacturerFuelSurcharge { get; set; }
        public int Terminal { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public int? TruckId { get; set; }
        public string TruckNumber { get; set; }
        public bool IsAcknowledged { get; set; }
        public bool IsDeleted { get; set; }

        public DriverModel Driver { get; set; }
    }
}
