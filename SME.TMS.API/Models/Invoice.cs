using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Models
{
    public class Invoice
    {
        public int InvoiceId { get; set; }
        public string VIN { get; set; }
        public int DispatchLoadNumber { get; set; }
        public int CompanyId { get; set; }
        public int TransactionStatusTypeId { get; set; }
        public int? DriverId { get; set; }
        public decimal? DriverRate { get; set; }
        public decimal? DriverFuelSurcharge { get; set; }
        public int ManufacturerId { get; set; }
        public decimal ManufacturerRate { get; set; }
        public decimal ManufacturerFuelSurcharge { get; set; }
        public int CenterId { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public int? TruckId { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }

        public ICollection<InvoiceRev> InvoiceRevisions { get; set; }
        public Company ReferencingCompany { get; set; }
        public Driver Driver { get; set; }
        public Truck Truck { get; set; }
        public TransactionStatusType TransactionStatusType { get; set; }
    }
}
