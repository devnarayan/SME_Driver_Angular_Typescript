using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SME.TMS.API.Models;

namespace SME.TMS.API.Interface.Responses
{
    public class GetDriverLookupsResponse
    {
        public List<PhoneNumberType> PhoneNumberTypes { get; set; }
        public List<StateProvince> StateProvinces { get; set; }
        public List<GenderType> GenderTypes { get; set; }
        public List<InsuranceProvider> InsuranceProviders { get; set; }
        public List<MedicalProvider> MedicalProviders { get; set; }
        public List<EthnicityType> EthnicityTypes { get; set; }
        public string LogoData { get; set; }



        public GetDriverLookupsResponse()
        {
            PhoneNumberTypes = new List<PhoneNumberType>();
            StateProvinces = new List<StateProvince>();
            GenderTypes = new List<GenderType>();
            InsuranceProviders = new List<InsuranceProvider>();
            MedicalProviders = new List<MedicalProvider>();
            EthnicityTypes = new List<EthnicityType>();
        }
    }
}
