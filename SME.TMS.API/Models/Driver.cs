using System;
using System.Collections.Generic;

namespace SME.TMS.API.Models
{
    public partial class Driver
    {
        public Driver()
        {
            DriverContract = new HashSet<DriverContract>();
            DriverEmail = new HashSet<DriverEmail>();
            DriverInsurance = new HashSet<DriverInsurance>();
            DriverMedicalHistory = new HashSet<DriverMedicalHistory>();
            DriverPhone = new HashSet<DriverPhone>();
        }

        public int DriverId { get; set; }
        public string AccountingDriverId { get; set; }
        public string Company { get; set; }
        public string FirstName { get; set; }
        public string Mn { get; set; }
        public string LastName { get; set; }
        public string FirstName2 { get; set; }
        public string Mn2 { get; set; }
        public string LastName2 { get; set; }
        public string PhoneNumber { get; set; }
        public string StreetAddressLine1 { get; set; }
        public string StreetAddressLine2 { get; set; }
        public string City { get; set; }
        public int? StateProvinceId { get; set; }
        public string StateProvinceAbbrev { get; set; }
        public string Zip { get; set; }
        public decimal? TruckValue { get; set; }
        public decimal? WorkingDeposit { get; set; }
        public double? PercentRetained { get; set; }
        public string Ssn { get; set; }
        public bool Label { get; set; }
        public string NewPayDisplayNotes { get; set; }
        public bool IsDirDeposit { get; set; }
        public bool Inactive { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? HireDate { get; set; }
        public DateTime? TermDate { get; set; }
        public bool IsReserveFor1099 { get; set; }
        public decimal? FlatRate { get; set; }
        public string MailTo { get; set; }
        public bool? Minority { get; set; }
        public string DcxsupplierId { get; set; }
        public string PayrollId { get; set; }
        public string Terminal { get; set; }
        public byte? IsCoDriver { get; set; }
        public int? Cap2Percent { get; set; }
        public string DashNotes { get; set; }
        public string TransferredFrom { get; set; }
        public DateTime? ContractExp { get; set; }
        public short? ContractTerm { get; set; }
        public bool? Dcxsupplier { get; set; }
        public int? GenderTypeId { get; set; }
        public string DriverLicenseNumber { get; set; }
        public DateTime? DriverLicenseExpiration { get; set; }
        public int? DriverLicenseStateProvinceId { get; set; }
        public int EthnicityTypeId { get; set; }
        public bool? IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int CompanyId { get; set; }

        public Company ReferencingCompany { get; set; }
        public GenderType GenderType { get; set; }
        public StateProvince StateProvince { get; set; }
        public EthnicityType EthnicityType { get; set; }
        public ICollection<DriverContract> DriverContract { get; set; }
        public ICollection<DriverEmail> DriverEmail { get; set; }
        public ICollection<DriverInsurance> DriverInsurance { get; set; }
        public ICollection<DriverMedicalHistory> DriverMedicalHistory { get; set; }
        public ICollection<DriverPhone> DriverPhone { get; set; }
    }
}
