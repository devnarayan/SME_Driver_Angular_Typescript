import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {
    User, DriverInfoModel, DriverInfoResult, DriverModel, DriverList, CurrentDriver,
    DriverEmail, DriverMedicalEvaluation, DriverInsurance, DriverContract, DriverPhone,
    PhoneNumberType, StateProvince, GenderType, InsuranceProvider, MedicalProvider, LookupRootObject
} from '../_models/index';
import { UserService, DriverService, ContractService, JournalService } from '../_services/index';
import { TestDialog } from '../dialogs/test.dialog';
//import { DriverEmailDialog } from '../dialogs/driver/driver.email.dialog';
//import { DriverPhoneDialog } from '../dialogs/driver/driver.phone.dialog';
import { ConfirmDialog } from '../dialogs/confirm.dialog';
import { ContractHistoryDialog } from '../dialogs/driver/contract.history.dialog';
import { AddDocDialog } from '../dialogs/maintenance/adddoc.dialog';
import { SidebarLocatorService } from '../_services/sidebar-locator.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {
    ContractRootObject, ContractListModel, ContractList, ContractLookupModel, FinanceType, Truck, CurrentContract,
    AssignedDriver, AssignedTruck, AssignedFinanceAgreement, CommonFunction
} from '../_models/contract';
import { JournalEntryInfoModel, JournalEntryInfoResult, JournalModel, CurrentJournalEntry, RecurringJournalEntryModel, JournalImportResult, JournalImportModel } from '../_models/journal';
declare var jquery: any;
declare var $: any;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
    selector: 'app-recurringentry',
    templateUrl: './recurringentry.component.html',
    styleUrls: ['./recurringentry.component.css']
})

export class RecurringentryComponent implements OnInit {
    driverInfoModel: DriverInfoModel;
    journalEntryInfoModel: JournalEntryInfoModel;
    recurringJournalList: JournalModel[];
    currentDriver: CurrentDriver = {};
    currentJournalEntry: CurrentJournalEntry = {};
    currentContract: CurrentContract = {}
    currentUser: User;
    drivers: DriverList[] = [];
    journalentries: RecurringJournalEntryModel[] = [];
    //filteredItems: DriverList[] = [];
    driverEmails: DriverEmail[] = [];
    //driverMedicalEvalutions: DriverMedicalEvaluation[] = [];
    //driverInsurances: DriverInsurance[] = [];
    driverContracts: DriverContract[] = [];
    driverPhones: DriverPhone[] = [];
    driverModel: DriverModel;
    journalEntryModel: JournalModel;
    journalImportResult: JournalImportResult;
    journalImportModel: JournalImportModel;
    journalImportList: JournalImportModel[] = [];

    contractInfo: ContractRootObject;
    contractListObj: ContractListModel;
    contracts: ContractList[] = [];
    filteredItems: ContractList[] = [];
    contractLookupModel: ContractLookupModel;
    financeTypeList: FinanceType[] = [];
    truckList: Truck[] = [];
    assignedDrivers: AssignedDriver[] = [];
    assignedTrucks: AssignedTruck[] = [];
    assignedFinanceAgreements: AssignedFinanceAgreement[] = [];
    contractName: string;

    amount: number;
    cycleDue: number;
    loanDate: Date;
    smeglAccount: string;
    interestRate: number;
    frequencyName: string;
    name: string;
    description: string;
    alias: string;

    driverLookupModel: LookupRootObject;
    driverPhoneTypes: PhoneNumberType[] = [];
    driverGenderTypes: GenderType[] = [];
    stateProvinces: StateProvince[] = [];
    insuranceProviders: InsuranceProvider[] = [];
    medicalProviders: MedicalProvider[] = [];

    gender: string;
    saveMessage: string;
    messageType: string;
    gendertype = [
        'Male',
        'Female',
    ];
    tabTitle: string;
    driverFullName: string;
    form: FormGroup;
    totalDueFormControl = new FormControl('', );
    smeDueFormControl = new FormControl('', );
    amountFormControl = new FormControl('', );
    interestRateFormControl = new FormControl('', [Validators.required]);
    nameFormControl = new FormControl('', [Validators.required]);
    aliasFormControl = new FormControl('', [Validators.required]);
    driverGLFormControl = new FormControl('', [Validators.required]);
    licenseNumberFormControl = new FormControl('', [Validators.required]);
    cityFormControl = new FormControl('', [Validators.required]);
    // stateFormControl = new FormControl('', [Validators.required]);
    zipFormControl = new FormControl('', [Validators.required]);
    ethncityFormControl = new FormControl('', [Validators.required]);
    genderFormControl = new FormControl('', [Validators.required]);
    activeFormControl = new FormControl('', [Validators.required]);
    dobFormControl = new FormControl('', [Validators.required]);
    hiredateFormControl = new FormControl('', [Validators.required]);
    licensenoFormControl = new FormControl('', [Validators.required]);
    licenseExpiryFormControl = new FormControl('', [Validators.required]);

    address2FormControl = new FormControl('', );
    termdateFormControl = new FormControl('', );
    payPerioddateFormControl = new FormControl('', );

    sidebar: SidebarComponent;

    private validateRequired(): boolean {
        if (!this.interestRateFormControl.invalid.valueOf()
            && !this.amountFormControl.invalid.valueOf()
            && !this.nameFormControl.invalid.valueOf()
            && !this.aliasFormControl.invalid.valueOf()
            && !this.driverGLFormControl.invalid.valueOf()
            && !this.licenseNumberFormControl.invalid.valueOf()
            && !this.cityFormControl.invalid.valueOf()
            //  && !this.stateFormControl.invalid.valueOf()
            && !this.zipFormControl.invalid.valueOf()
            && !this.ethncityFormControl.invalid.valueOf()
            // && !this.genderFormControl.dirty.valueOf()
            //&& !this.activeFormControl.dirty.valueOf()
            && !this.dobFormControl.invalid.valueOf()
            && !this.hiredateFormControl.invalid.valueOf()
            && !this.licensenoFormControl.invalid.valueOf()
            && !this.licenseExpiryFormControl.invalid.valueOf()
        ) {
            return true;
        }
        else
            return false;
    }
    private validateUnSaved(): boolean {
        if (!this.interestRateFormControl.dirty
            && !this.amountFormControl.dirty
            && !this.nameFormControl.dirty
            && !this.aliasFormControl.dirty
            && !this.driverGLFormControl.dirty
            && !this.licenseNumberFormControl.dirty
            && !this.cityFormControl.dirty
            // && !this.stateFormControl.dirty
            && !this.zipFormControl.dirty
            && !this.ethncityFormControl.dirty
            // && !this.genderFormControl.dirty.valueOf()
            // && !this.activeFormControl.dirty.valueOf()
            && !this.dobFormControl.dirty
            && !this.hiredateFormControl.dirty
            && !this.licensenoFormControl.dirty
            && !this.licenseExpiryFormControl.dirty

            && !this.address2FormControl.dirty
            && !this.termdateFormControl.dirty
            && !this.payPerioddateFormControl.dirty
        ) {
            return true;
        }
        else
            return false;
    }
    constructor(fb: FormBuilder, private userService: UserService, private driverService: DriverService, private contractService: ContractService,
        private journalService: JournalService, private sidebarService: SidebarLocatorService, public dialog: MdDialog, public http: Http) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.currentDriver.genderID = 1;
        this.form = fb.group({
            interestRateFormControl: this.interestRateFormControl,
            amountFormControl: this.amountFormControl,
            nameFormControl: this.nameFormControl,
            aliasFormControl: this.aliasFormControl,
            driverGLFormControl: this.driverGLFormControl,
            licenseNumberFormControl: this.licenseNumberFormControl,
            cityFormControl: this.cityFormControl,
            //  stateFormControl: this.stateFormControl,
            zipFormControl: this.zipFormControl,
            ethncityFormControl: this.ethncityFormControl,
            genderFormControl: this.genderFormControl,
            activeFormControl: this.activeFormControl,
            dobFormControl: this.dobFormControl,
            hiredateFormControl: this.hiredateFormControl,
            licensenoFormControl: this.licensenoFormControl,
            licenseExpiryFormControl: this.licenseExpiryFormControl,

            address2FormControl: this.address2FormControl,
            termdateFormControl: this.termdateFormControl,
            payPerioddateFormControl: this.payPerioddateFormControl,
        });
    }

    ngOnInit() {
        this.tabTitle = "Dispatch";
        this.sidebar = this.sidebarService.getSidebar();
        this.sidebar.OnClicked.asObservable().subscribe(param => this.selectContract(param));
        //this.loadDriverList(0);
        //this.loadDriverLookup();
        this.loadContractList(0);
        this.loadContractLookup();
        this.loadRecurringJournalEntryInfo(9128);
        //this.loadJournalEntryList();
        //this.loadRecurringJournalEntryInfo(11);

    }
    private loadContractInfo(contractId: number) {
        this.contractService.getContractInfo(contractId.toString(), this.currentUser).subscribe(contract => {
            this.contractInfo = contract;
            if (this.contractInfo.isCompletedSuccessfully) {
                this.currentContract = this.contractInfo.result.currentContract;
                this.assignedDrivers = this.currentContract.assignedDrivers;
                this.assignedTrucks = this.currentContract.assignedTrucks;
                this.assignedFinanceAgreements = this.currentContract.assignedFinanceAgreements;
                this.loadRecurringJournalEntryInfo(this.currentContract.contractId);
                // this.updatePhoneType();
                this.saveMessage = "";
                this.messageType = "info";
            }
        });
    }

    selectContract(contractId: number) {
        this.loadContractInfo(contractId);
    }

    assignCopy() {
        this.filteredItems = Object.assign([], this.contracts);
    }

    private loadContractList(contractId: number) {
        this.contractService.getContractList(contractId.toString(), this.currentUser).subscribe(contractdata => {
            this.contractListObj = contractdata;
            this.contracts = this.contractListObj.contractList;
            this.sidebar.ParseList<ContractList>(this.contracts, (x) => x.contractName, (x) => x.contractId);
            this.loadContractInfo(this.contracts[0].contractId);
            this.assignCopy();
        });
    }

    private loadContractLookup() {
        this.contractService.getContractLookup(this.currentUser).subscribe(contractLookupdata => {
            this.contractLookupModel = contractLookupdata;
            this.financeTypeList = this.contractLookupModel.financeTypes;
            this.truckList = this.contractLookupModel.trucks;

            //this.logoData = 'data:image/jpg;base64,' + this.contractLookupModel.logoData;
        });
    }
    selectPreContract() {
        for (var i = 0; i < this.contracts.length - 1; i++) {
            if (this.contracts[i].contractId == this.currentContract.contractId) {
                if (i != 0) {
                    this.loadContractInfo(this.contracts[i - 1].contractId);
                    this.loadRecurringJournalEntryInfo(this.currentContract.contractId);
                }
            }
        }
    }
    selectNextContract() {
        for (var i = 0; i < this.contracts.length - 1; i++) {
            if (this.contracts[i].contractId == this.currentContract.contractId) {
                if (i != this.contracts.length - 1) {
                    this.loadContractInfo(this.contracts[i + 1].contractId);
                    this.loadRecurringJournalEntryInfo(this.currentContract.contractId);
                }
            }
        }
    }

    addNewContract() {
        this.currentContract = new CurrentContract();
        this.currentContract.contractId = 0;
        this.assignedDrivers = new Array<AssignedDriver>();
        this.assignedTrucks = new Array<AssignedTruck>();
        this.assignedFinanceAgreements = new Array<AssignedFinanceAgreement>();
    }
    selectTab(tabName: string): void {
        this.tabTitle = tabName;
    }
    addNewDriver() {
        this.currentDriver = new CurrentDriver();
        this.currentDriver.driverId = 0;
        this.driverContracts = new Array<DriverContract>();
        // this.driverEmails = new Array<DriverEmail>();
        //this.driverPhones = new Array<DriverPhone>();
        //this.driverInsurances = new Array<DriverInsurance>();
        //this.driverMedicalEvalutions = new Array<DriverMedicalEvaluation>();
    }
    //#region Dialog Operations(Email, Phone, Contract History etc.)

    editContractHistoryDialog(contract: DriverContract) {
        let contractHisDialogRef = this.dialog.open(ContractHistoryDialog, {
            width: '380px',
            height: '420px',
            data: {
                title: 'Update Contract Assignment History',
                driverContractID: contract.driverContractID,
                driverID: contract.driverID,
                driverContractName: contract.driverContractName,
                driverContractNumber: contract.driverContractNumber,
                driverContractStartDate: contract.driverContractStartDate,
                driverContractEndDate: contract.driverContractEndDate
            }
        });

        contractHisDialogRef.afterClosed().subscribe(result => {
            if (result != undefined) {
                let contract = new DriverContract;
                contract.driverContractName = result.driverContractName;
                contract.driverContractID = result.driverContractID;
                contract.driverContractNumber = result.driverContractNumber;
                contract.driverContractStartDate = result.driverContractStartDate;
                contract.driverContractEndDate = result.driverContractEndDate;
                contract.driverID = result.driverID;

                let updateItem = this.driverContracts.find(this.findDriverContractIndexToUpdate, contract.driverContractID);

                let index = this.driverContracts.indexOf(updateItem);

                this.driverContracts[index] = contract;
                this.saveMessage = "Driver information have unsaved changes.";
                this.messageType = "info";
            }
        });
    }

    findIndexToUpdate(newItem) {
        return newItem.driverEmailAddressID === this;
    }
    findDriverContractIndexToUpdate(newItem) {
        return newItem.driverContractID === this;
    }
    findPhoneIndexToUpdate(newItem) {
        return newItem.driverPhoneID === this;
    }
    findDocImportIndexToUpdate(newItem) {
        return newItem.journalImportId === this;
    }

    findGenderTypeIndex(newItem) {
        return newItem.genderTypeId === this;
    }
    //#endregion


    //#region  Search driver
    // assignCopy() {
    //     this.filteredItems = Object.assign([], this.drivers);
    // }
    filterItem() {
        if (!this.contractName) this.assignCopy(); //when nothing has typed
        this.filteredItems = Object.assign([], this.contracts).filter(
            item => item.contractName.toString().toLowerCase().indexOf(this.contractName.toString().toLowerCase()) > -1
        )
        if (this.filteredItems.length == 0) {
            this.saveMessage = "Contract not found!!!";
            this.messageType = "info";
        }
        else {
            this.saveMessage = "";
            this.messageType = "info";
        }
        this.sidebar.ParseList(this.filteredItems, x => x.contractName, x => x.contractId);
    }

    //#endregion

    activeactiveChange(isActive: boolean) {
        if (isActive == true) {
            this.currentDriver.isActive = false;
        } else {
            this.currentDriver.isActive = true;
        }
    }

    // Update PhoneType to driver phone list.
    private updateEmailPrimaryType(driverEmailAddressID: number, isPrimary: boolean) {
        var isPrimaryFound: boolean;
        isPrimaryFound = false;
        this.driverEmails.forEach(element => {
            let updateItem = this.driverPhoneTypes.find(this.findIndexToUpdate, element.driverEmailAddressID);
            if (driverEmailAddressID == element.driverEmailAddressID) {
                element.isPrimary = isPrimary;
                isPrimaryFound = isPrimary;
            }
            else
                element.isPrimary = false;
        });
        if (isPrimaryFound == false) {
            if (this.driverEmails.length > 0) {
                this.driverEmails[0].isPrimary = true;
            }
        }
    }

    private getGenderName(genderID: number): string {
        var genderType: string;
        genderType = "Male";
        this.driverGenderTypes.forEach(element => {
            if (element.genderTypeId == genderID) {
                let updateItem = this.driverGenderTypes.find(this.findGenderTypeIndex, element.genderTypeId);
                genderType = updateItem.genderTypeName;
            }
        });
        return genderType;
    }
    public getGenderId(): number {
        var genderId: number;
        genderId = 1;
        this.driverGenderTypes.forEach(element => {
            if (element.genderTypeName == this.gender) {
                let updateItem = this.driverGenderTypes.find(this.findGenderTypeIndex, element.genderTypeId);
                genderId = element.genderTypeId;
            }
        });
        return genderId;
    }
    //#region  Load driver information
    selectDriver(driverId: number) {
        this.loadDriverInfo(driverId);
    }
    isActive(driverId: number) {
        if (this.currentDriver.driverId == driverId) {
            return true;
        }
        return false;
    }
    selectPreDriver() {
        for (var i = 0; i < this.drivers.length - 1; i++) {
            if (this.drivers[i].driverId == this.currentDriver.driverId) {
                if (i != 0) {
                    this.loadDriverInfo(this.drivers[i - 1].driverId);
                }
            }
        }
    }
    selectNextDriver() {
        for (var i = 0; i < this.drivers.length - 1; i++) {
            if (this.drivers[i].driverId == this.currentDriver.driverId) {
                if (i != this.drivers.length - 1) {
                    this.loadDriverInfo(this.drivers[i + 1].driverId);
                }
            }
        }

        this.driverService.getDriverList(this.currentUser).subscribe(driverdata => {
            this.driverModel = driverdata;
            this.drivers = this.driverModel.driverList;
            this.sidebar.ParseList(this.drivers, x => x.driverFullName, x => x.driverId);
            this.loadDriverInfo(this.drivers[0].driverId);
            this.assignCopy();
        });
    }

    openAddDocDialog(): void {
        let docDialogRef = this.dialog.open(AddDocDialog, {
            width: '400px',
            height: '260px',
            data: { title: 'Add new document.', doctitle: "", journalEntryId: this.currentJournalEntry.journalEntryId }
        });

        docDialogRef.afterClosed().subscribe(result => {
            console.log('Doc added.');
            if (result != undefined) {
                this.loadJournalImportList(this.currentJournalEntry.journalEntryId);
            }
        });
    }
    deleteImportDialog(journalImportId: string): void {
        let phoneDialogRef = this.dialog.open(ConfirmDialog, {
            width: '400px',
            data: { title: 'Confirm to delete document?', driverPhoneID: journalImportId }
        });

        phoneDialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');

            this.journalService.deleteJournalImport(this.currentUser, journalImportId).subscribe(importListdata => {
                let updateItem = this.journalImportList.find(this.findDocImportIndexToUpdate, journalImportId);
                let index = this.journalImportList.indexOf(updateItem);
                this.journalImportList.splice(index, 1);
            });

        });
    }

    downloadDoc(journalImportId: string): void {
        this.http.get('assets/config.json').map(x => x.json().baseUrl).subscribe(data => {
            var downUrl = data + "/api/journal/DownloadJournalImport?imageId=" + journalImportId;
            window.open(downUrl, "_blank");
        });
    }


    private loadDriverInfo(driverId: number) {
        this.driverService.getDrivers(driverId.toString(), this.currentUser).subscribe(driver => {
            this.driverInfoModel = driver;
            if (this.driverInfoModel.isCompletedSuccessfully) {
                this.currentDriver = this.driverInfoModel.result.currentDriver;
                this.driverPhones = this.currentDriver.driverPhones;
                this.driverEmails = this.currentDriver.driverEmails;
                this.driverContracts = this.currentDriver.driverContracts;
                // this.driverInsurances = this.currentDriver.driverInsurances;
                // this.driverMedicalEvalutions = this.currentDriver.driverMedicalEvaluations;
                this.gender = this.getGenderName(this.currentDriver.genderID);

                //this.updatePhoneType();
                this.saveMessage = "";
                this.messageType = "info";
            }
        });
    }
    private loadRecurringJournalEntryInfo(contractId) {
        this.journalService.getJournalEntries(this.currentUser, 2, 0, contractId, 0).subscribe(journalEntry => {
            this.journalEntryInfoModel = journalEntry;
            if (this.journalEntryInfoModel.isCompletedSuccessfully) {
                if (this.journalEntryInfoModel.result.currentJournalEntry == null) {
                    this.saveMessage = "No recurring entries found for this contract!!!";
                    this.messageType = "info";
                } else {
                    this.currentJournalEntry = this.journalEntryInfoModel.result.currentJournalEntry;
                    this.amount = this.currentJournalEntry.amount;
                    this.cycleDue = this.currentJournalEntry.cycleDue;
                    this.loanDate = this.currentJournalEntry.loanDate;
                    this.interestRate = this.currentJournalEntry.interestRate;
                    this.frequencyName = this.currentJournalEntry.frequencyName;
                    this.name = this.currentJournalEntry.name;
                    this.description = this.currentJournalEntry.description;
                    this.alias = this.currentJournalEntry.description;
                    //this.currentDriver.driverFullName = this.driver.driverFullName;
                    //this.settlements
                    //this.journalentryId
                    //this.contractName = this.currentJournalEntry.name;
                    //this.type
                    //this.description 
                    //this.driverGLAccount

                    this.loadJournalImportList(this.currentJournalEntry.journalEntryId);

                    this.smeglAccount = this.currentJournalEntry.smeglAccount;
                    this.saveMessage = "";
                    this.messageType = "info";
                }
            }
        });
    }

    private loadJournalEntryList() {
        this.journalService.getJournalEntries(this.currentUser, 2, 11, 9128, 0).subscribe(journalentrydata => {
            this.journalEntryInfoModel = journalentrydata;
            if (this.journalEntryInfoModel.isCompletedSuccessfully) {
                //this.amount = this.journalEntryInfoModel.result.currentJournalEntry.amount;
                //this.currentJournalEntry.amount = this.journalEntryInfoModel[1].amount;
                //this.saveMessage = "";
                //this.messageType = "info";
            }
        });
    }

    private loadDriverList(driverId: number) {
        this.driverService.getDriverList(this.currentUser).subscribe(driverdata => {
            this.driverModel = driverdata;
            this.drivers = this.driverModel.driverList;
            this.sidebar.ParseList(this.drivers, x => x.driverFullName, x => x.driverId);
            this.loadDriverInfo(this.drivers[0].driverId);
            this.assignCopy();
        });
    }

    private loadDriverLookup() {
        this.driverService.getDriverLookup(this.currentUser).subscribe(driverLookupdata => {
            this.driverLookupModel = driverLookupdata;
            this.driverPhoneTypes = this.driverLookupModel.phoneNumberTypes;
            this.driverGenderTypes = this.driverLookupModel.genderTypes;
            this.stateProvinces = this.driverLookupModel.stateProvinces;
            this.insuranceProviders = this.driverLookupModel.insuranceProviders;
            this.medicalProviders = this.driverLookupModel.medicalProviders;
        });
    }

    private loadJournalImportList(journalEntryId: number) {
        this.journalService.getJournalImportList(this.currentUser, journalEntryId).subscribe(importListdata => {
            this.journalImportResult = importListdata;
            this.journalImportList = this.journalImportResult.result;
        });
    }
}

