    
        export class DriverPhone {
            driverPhoneID: number;
            driverID: number;
            driverPhoneTypeID: number;
            driverPhoneType: string;
            driverPhoneNumber: string;
            isPrimary: boolean;
        }

        export class DriverEthnicity {
            driverID: number;
            driverEthnicityTypeID: number;
            driverEthnicityTypeName: string;
        }

        export class DriverStateProvince {
            driverID: number;
            driverStateProvinceId: number;
            driverStateProvinceName: string;
            //driverStateProvinceAbbreviation: string;
        }
    
        export class DriverContract {
            driverContractID: number;
            driverID: number;
            driverContractName: string;
            driverContractNumber: string;
            driverContractStartDate: Date;
            driverContractEndDate: Date;
        }
    
        export class DriverInsurance {
            driverInsuranceID: number;
            driverID: number;
            driverInsuranceProviderID: number;
            driverInsureanceProviderName: string;
            driverInsuranceProviderRate: number;
            driverInsuranceStartDate: Date;
            driverInsuranceEndDate: Date;
        }
    
        export class DriverMedicalEvaluation {
            driverMedicalEvaluationID: number;
            driverID: number;
            driverMedicalProviderID: number;
            driverMedicalProviderName: string;
            driverMedicalProviderRate: number;
            driverMedicalEffectiveDate: Date;
            driverMedicalExpirationDate: Date;
        }
    
        export class DriverEmail {
            driverEmailAddressID: number;
            driverID: number;
            driverEmailAddress: string;
            isPrimary: boolean;
        }
    
        export class CurrentDriver {
            driverId?: number;
            driverAccountingId?: string;
            driverFullName?: string;
            driverFirstName?: string;
            driverLastName?: string;
            driverStreetAddressLine1?: string;
            driverStreetAddressLine2?: any;
            driverCity?: string;
            driverStateProvinceId?: number;
            driverStateProvinceName?: string;
            driverZip?: string;
            ethnicityTypeId?: number;
            ethnicityTypeName?: string;
            genderID?: number;
            isActive?: boolean;
            dateOfBirth?: Date;
            hireDate?: Date;
            termDate?: Date;
            currentPayPeriod?: Date;
            driverReportURL?: string;
            recentDriverEvaluationDate?: Date;
            recentDriverMedicalExpirationDate?: Date;
            driverLicenseNumber?: any;
            driverLicenseExpirationDate?: Date;
            recentDriverInsuranceProviderId?: number;
            recentDriverInsureanceProviderName?: string;
            recentDriverInsuranceProviderRate?: number;
            recentDriverInsurancePolicyURL?: string;
            driverPhones?: DriverPhone[];
            driverContracts?: DriverContract[];
            driverInsurances?: DriverInsurance[];
            driverMedicalEvaluations?: DriverMedicalEvaluation[];
            driverEmails?: DriverEmail[];
        }
    
        export class DriverList {
            driverId: number;
            driverFullName: string;
        }
    
        export class DriverModel {
            currentDriver: CurrentDriver;
            driverList: DriverList[];
        }

        export class DriverInfoResult {
            currentDriver: CurrentDriver;
        }
    
        export class DriverInfoModel {
            result: DriverInfoResult;
            id: number;
            exception?: any;
            status: number;
            isCanceled: boolean;
            isCompleted: boolean;
            isCompletedSuccessfully: boolean;
            creationOptions: number;
            asyncState?: any;
            isFaulted: boolean;
        }
    