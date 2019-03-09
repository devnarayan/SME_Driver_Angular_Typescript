using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface
{
    public class DriverModel
    {
        public int DriverId { get; set; }
        public string DriverAccountingId { get; set; }
        public string DriverFullName { get; set; }
        public string DriverFirstName { get; set; }
        public string DriverLastName { get; set; }
        public string DriverStreetAddressLine1 { get; set; }
        public string DriverStreetAddressLine2 { get; set; }
        public string DriverCity { get; set; }
        public int DriverStateProvinceId { get; set; }
        public string DriverStateProvinceName { get; set; }
        public string DriverZip { get; set; }
        public string EthnicityID { get; set; }
        public int GenderID { get; set; }
        public bool IsActive { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime HireDate { get; set; }
        public DateTime? TermDate { get; set; }
        public DateTime CurrentPayPeriod { get; set; }
        public string DriverReportURL { get; set; }
        //safety data
        public DateTime? RecentDriverEvaluationDate { get; set; }
        public DateTime? RecentDriverMedicalExpirationDate { get; set; }
        public string DriverLicenseNumber { get; set; }
        public DateTime? DriverLicenseExpirationDate { get; set; }
        public int RecentDriverInsuranceProviderId { get; set; }
        public string RecentDriverInsureanceProviderName { get; set; }
        public decimal RecentDriverInsuranceProviderRate { get; set; }
        public string RecentDriverInsurancePolicyURL { get; set; }
        // Ethnicity Data
        public int EthnicityTypeId { get; set; }
        public string EthnicityTypeName { get; set; }
        public bool IsMinority { get; set; }

        public List<DriverPhoneModel> DriverPhones { get; set; }
        public List<DriverContractModel> DriverContracts { get; set; }
        public List<DriverInsuranceModel> DriverInsurances { get; set; }
        public List<DriverMedicalEvaluationModel> DriverMedicalEvaluations { get; set; }
        public List<DriverEmailModel> DriverEmails { get; set; }

        public DriverModel()
        {
            DriverId = 0;
            DriverAccountingId = "";
            DriverFullName = "";
            DriverFirstName = "";
            DriverLastName = "";
            DriverStreetAddressLine1 = "";
            DriverStreetAddressLine2 = "";
            DriverCity = "";
            DriverStateProvinceId = 0;
            DriverStateProvinceName = "";
            DriverZip = "";
            EthnicityID = "";
            GenderID = 0;
            IsActive = false;
            DateOfBirth = new DateTime(1900,1,1);
            HireDate = new DateTime(1900, 1, 1);
            TermDate = new DateTime(1900, 1, 1);
            CurrentPayPeriod = new DateTime(1900, 1, 1);
            DriverReportURL = "";
            //safety data
            RecentDriverEvaluationDate = new DateTime(1900, 1, 1);
            RecentDriverMedicalExpirationDate = new DateTime(1900, 1, 1);
            DriverLicenseNumber = "";
            DriverLicenseExpirationDate = new DateTime(1900, 1, 1);
            RecentDriverInsuranceProviderId = 0;
            RecentDriverInsureanceProviderName = "";
            RecentDriverInsuranceProviderRate = 0;
            RecentDriverInsurancePolicyURL = "";

            DriverPhones = new List<DriverPhoneModel>();
            DriverContracts = new List<DriverContractModel>();
            DriverInsurances = new List<DriverInsuranceModel>();
            DriverMedicalEvaluations = new List<DriverMedicalEvaluationModel>();
            DriverEmails = new List<DriverEmailModel>();
        }

    }

    public class DriverPhoneModel
    {
        //DRIVER PHONE NUMBERS
        public int DriverPhoneID { get; set; }
        public int DriverID { get; set; }
        public int DriverPhoneTypeID { get; set; }
        public string DriverPhoneNumber { get; set; }
        public bool IsPrimary { get; set; }

        public DriverPhoneModel()
        {
            DriverPhoneID = 0;
            DriverID = 0;
            DriverPhoneTypeID = 0;
            DriverPhoneNumber = "";
            IsPrimary = false;
        }
    }

    public class DriverContractModel
    {
        //DRIVER CONTRACTS
        public int DriverContractID { get; set; }
        public int DriverID { get; set; }
        public string DriverContractName { get; set; }
        public string DriverContractNumber { get; set; }
        public DateTime DriverContractStartDate { get; set; }
        public DateTime DriverContractEndDate { get; set; }
        public string ResponsibleParty { get; set; }

        public DriverContractModel()
        {
            DriverContractID = 0;
            DriverID = 0;
            DriverContractName = "";
            DriverContractNumber = "";
            DriverContractStartDate = new DateTime(1900, 1, 1);
            DriverContractEndDate = new DateTime(1900, 1, 1);
            ResponsibleParty = "";
        }
    }

    public class DriverInsuranceModel
    {
        //DRIVER INSURANCE HISTORY
        public int DriverInsuranceID { get; set; }
        public int DriverID { get; set; }
        public int DriverInsuranceProviderID { get; set; }
        public string DriverInsureanceProviderName { get; set; }
        public decimal DriverInsuranceProviderRate { get; set; }
        public DateTime DriverInsuranceStartDate { get; set; }
        public DateTime DriverInsuranceEndDate { get; set; }

        public DriverInsuranceModel()
        {
            DriverInsuranceID = 0;
            DriverID = 0;
            DriverInsuranceProviderID = 0;
            DriverInsureanceProviderName = "";
            DriverInsuranceProviderRate = 0;
            DriverInsuranceStartDate = new DateTime(1900, 1, 1);
            DriverInsuranceEndDate = new DateTime(1900, 1, 1);
        }
    }

    public class DriverMedicalEvaluationModel
    {
        //DRIVER MEDICAL EVALUATION HISTORY
        public int DriverMedicalEvaluationID { get; set; }
        public int DriverID { get; set; }
        public int DriverMedicalProviderID { get; set; }
        public string DriverMedicalProviderName { get; set; }
        public decimal DriverMedicalProviderRate { get; set; }
        public DateTime DriverMedicalEffectiveDate { get; set; }
        public DateTime DriverMedicalExpirationDate { get; set; }

        public DriverMedicalEvaluationModel()
        {
            DriverMedicalEvaluationID = 0;
            DriverID = 0;
            DriverMedicalProviderID = 0;
            DriverMedicalProviderName = "";
            DriverMedicalProviderRate = 0;
            DriverMedicalEffectiveDate = new DateTime(1900, 1, 1);
            DriverMedicalExpirationDate = new DateTime(1900, 1, 1);
        }
    }

    public class DriverEmailModel
    {
        //DRIVER EMAIL
        public int DriverEmailAddressID { get; set; }
        public int DriverID { get; set; }
        public string DriverEmailAddress { get; set; }
        public bool IsPrimary { get; set; }

        public DriverEmailModel()
        {
            DriverEmailAddressID = 0;
            DriverID = 0;
            DriverEmailAddress = "";
            IsPrimary = false;
        }
    }
}
