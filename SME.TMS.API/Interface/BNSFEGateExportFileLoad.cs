using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SME.Dispatch.Business.BusinessObjects
{
    public class BNSFEGateExportFileLoad 
    {
        public string CarrierSCAC { get; set; }
        public string RampCode { get; set; }
        public string DriverLicense { get; set; }
        public string GatePassCode { get; set; }
        public string DispatchLoadNumber { get; set; }
        public DateTime StatusDate { get; set; }
        public string TrailerNumber { get; set; }
        public string TruckNumber { get; set; }
        public List<BNSFEGateExportFileVehicle> Vehicles { get; set; }
        public int CenterID { get; set; }
        public int TruckDispatchID { get; set; }


        public BNSFEGateExportFileLoad()
        {
            CarrierSCAC = "";
            RampCode = "";
            DriverLicense = "";
            GatePassCode = "";
            TrailerNumber = "";
            DispatchLoadNumber = "";
            StatusDate = DateTime.MinValue;
            Vehicles = new List<BNSFEGateExportFileVehicle>();
            CenterID = int.MinValue;
            TruckDispatchID = int.MinValue;
        }
    }

    public class BNSFEGateExportFileVehicle 
    {
        public string VIN { get; set; }
        public List<Inspection> InspectionHistory { get; set; }

        public BNSFEGateExportFileVehicle()
        {
            VIN = "";
            InspectionHistory = new List<Inspection>();
        }
    }

    public class BNSFEGateJsonLoad
    {
        public string carrierScac { get; set; }
        public string driverLicense { get; set; }
        public string outGateLocation { get; set; }
        public string gatePassCode { get; set; }
        public string loadNumber { get; set; }
        public string trailerNumber { get; set; }
        public string truckNumber { get; set; }
        public List<BNSFEGateJsonLoadedVin> loadedVehicles { get; set; }


        public BNSFEGateJsonLoad()
        {
            carrierScac = "";
            driverLicense = "";
            outGateLocation = "";
            gatePassCode = "";
            loadNumber = "";
            trailerNumber = "";
            truckNumber = "";
            loadedVehicles = new List<BNSFEGateJsonLoadedVin>();
        }

    }


    public class BNSFEGateJsonLoadedVin
    {
        public string vin { get; set; }
        public List<BNSFEGateJsonDamage> damages { get; set; }

        public BNSFEGateJsonLoadedVin()
        {
            vin = "";
            damages = new List<BNSFEGateJsonDamage>();
        }
    }

    public class BNSFEGateJsonDamage
    {
        public string location { get; set; }
        public string type { get; set; }
        public string severity { get; set; }

        public BNSFEGateJsonDamage()
        {
            location = "";
            type = "";
            severity = "";
        }
    }


    //RESPONSE DATA BACK FROM BNSF
    public class BNSFEGateJsonLoadResponse
    {
        public string haulPass { get; set; }
        public BNSFEGateJsonLoad gateExitRequest { get; set; }
        public List<BNSFEGateJsonLoadResponseError> errors { get; set; }


        public BNSFEGateJsonLoadResponse()
        {
            haulPass = "";
            gateExitRequest = new BNSFEGateJsonLoad();
            errors = new List<BNSFEGateJsonLoadResponseError>();
        }

    }

    public class BNSFEGateJsonLoadResponseError
    {
        public string vin { get; set; }
        public string message { get; set; }
        public string code { get; set; }

        public BNSFEGateJsonLoadResponseError()
        {
            vin = "";
            message = "";
            code = "";
        }
    }
}
