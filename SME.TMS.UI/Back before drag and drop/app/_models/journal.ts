export class RecurringJournalEntryModel {
    frequencyTypeId: number;
    frequencyName: string;
    loanDate: Date;
    cycleDue?: number;
    interestRate: number;
    settlements?: number;
    journalEntryId: number;
    name; string;
    type: string;
    amount: number;
    description?: string;
    driverGLAccount: string;
    smeglAccount: string;
}


export class CurrentJournalEntry {
    frequencyTypeId?: number;
    frequencyName?: string;
    loanDate?: Date;
    cycleDue?: number;
    interestRate?: number;
    settlements?: number;
    journalEntryId?: number;
    name?: string;
    type?: string;
    amount?: number;
    description?: string;
    driverGLAccount?: string;
    smeglAccount?: string;
    driver?: journalAssignedDriver[];
}

export class journalAssignedDriver {
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
}


export class JournalModel {
    currentJournalEntry: CurrentJournalEntry;
    recurringJournalList: RecurringJournalEntryModel[];
}

export class JournalEntryInfoResult {
    currentJournalEntry: CurrentJournalEntry;
}

export class JournalEntryInfoModel {
    result: JournalEntryInfoResult;
    id: number;
    exception?: any;
    status: number;
    isCanceled: boolean;
    isCompleted: boolean;
    isCompletedSuccessfully: boolean;
    creationOptions: number;
    asyncState?: any;
    isFaulted: boolean;
    //journalEntries : RecurringJournalEntryModel[];
}

export class JournalImportResult{
    result: JournalImportModel[];
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

export class JournalImportModel{
    journalImportId?:string;
    journalEntryId?:number;
    dotTitle?:string;
    filePath?:string;
    fileName?:string;
}

  
export class TemplateDefinitionModel {
    templateDefinitionId: number;
    templateDefinitionName?: any;
    templateDefinitionDesc: string;
    templateDefinitionSchema?: any;
    vendorId?: any;
    openCount?:number;
  }

  export class ImportExpenseModel {
    importedExpenseId: number;
    templateDefinitionId?:number;
    driverId?:number;
    contractId?:number;
    truckId?:number;
    transactionDate?:Date;
    transactionDesc?:string;
    transactionNumber?:string;
    driverAmount?:number;
    smeAmount?:number;
    isOpen:boolean;
    importDate?:Date;
    importByUser?:string;

    truckNumber?:Date;
    driverName?:string;
    contractName?:string;
  }

  export class TruckDriverModel {
    driverId?:number;
    contractId?:number;
    truckId?:number;
    truckNumber?:Date;
    driverName?:string;
    contractName?:string;
  }