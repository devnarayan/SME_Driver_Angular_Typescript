export class PhoneNumberType {
    phoneNumberTypeId: number;
    phoneNumberTypeName: string;
    isActive: boolean;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    modifiedDate: Date;
    driverPhone: any[];
}

export class EthnicityType {
    ethnicityTypeId: number;
    ethnicityTypeName: string;
    isActive: boolean;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    modifiedDate: Date;
    driver: any[];
}

export class StateProvince {
    stateProvinceId: number;
    stateProvinceName: string;
    //stateProvinceAbbreviation: string;
    countryId: number;
    isActive: boolean;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    modifiedDate: Date;
    driver: any[];
}

export class GenderType {
    genderTypeId: number;
    genderTypeAbbrev: string;
    genderTypeName: string;
    isActive: boolean;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    modifiedDate: Date;
    driver: any[];
}

export class InsuranceProvider {
    insuranceProviderId: number;
    insuranceProviderName: string;
    isActive: boolean;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    modifiedDate: Date;
    driverInsurance: any[];
}

export class MedicalProvider {
    medicalProviderId: number;
    medicalProviderName: string;
    isActive: boolean;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    modifiedDate: Date;
    driverMedicalHistory: any[];
}

export class LookupRootObject {
    phoneNumberTypes: PhoneNumberType[];
    ethnicityTypes: EthnicityType[];
    stateProvinces: StateProvince[];
    genderTypes: GenderType[];
    logoData: string;
    insuranceProviders: InsuranceProvider[];
    medicalProviders: MedicalProvider[];
}


