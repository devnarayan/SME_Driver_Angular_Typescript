import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    User, DriverInfoModel, DriverInfoResult, DriverModel, DriverList, CurrentDriver, 
    DriverEmail, DriverMedicalEvaluation, DriverInsurance, DriverContract, DriverPhone,
    PhoneNumberType, StateProvince, GenderType, InsuranceProvider, MedicalProvider, LookupRootObject
} from '../../_models/index';
import {
    ContractRootObject, ContractListModel, ContractList, ContractLookupModel, FinanceType, Truck, CurrentContract,
    AssignedDriver, AssignedTruck, AssignedFinanceAgreement, CommonFunction
  } from '../../_models/contract';
import { UserService, DriverService, ContractService } from '../../_services/index';
import { DriverEmailDialog } from '../../dialogs/driver/driver.email.dialog';
import { DriverPhoneDialog } from '../../dialogs/driver/driver.phone.dialog';
import { ConfirmDialog } from '../../dialogs/confirm.dialog';
import { ContractHistoryDialog } from '../../dialogs/driver/contract.history.dialog';
import { InsuranceHistoryDialog } from '../../dialogs/driver/insurance.history.dialog';
import { MedicalEvaluationHistoryDialog } from '../../dialogs/driver/medical.history.dialog';
import { SidebarLocatorService } from '../../_services/sidebar-locator.service';
import { SidebarComponent } from '../../sidebar/sidebar.component';
declare var jquery:any;
declare var $ :any;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.css']
})

export class ComplianceComponent implements OnInit {
  driverInfoModel: DriverInfoModel;
  currentDriver: CurrentDriver = {};
  currentUser: User;
  drivers: DriverList[] = [];
  //filteredItems: DriverList[] = [];
  driverEmails: DriverEmail[] = [];
  driverMedicalEvalutions: DriverMedicalEvaluation[] = [];
  driverInsurances: DriverInsurance[] = [];
  driverContracts: DriverContract[] = [];
  driverPhones: DriverPhone[] = [];
  driverModel: DriverModel;

  driverLookupModel: LookupRootObject;
  driverPhoneTypes: PhoneNumberType[] = [];
  driverGenderTypes: GenderType[] = [];
  stateProvinces: StateProvince[] = [];
  insuranceProviders: InsuranceProvider[] = [];
  medicalProviders: MedicalProvider[] = [];
  
  currentContract: CurrentContract = {};
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

  firstNameFormControl = new FormControl('', [Validators.required]);
  lastNameFormControl = new FormControl('', [Validators.required]);
  addressFormControl = new FormControl('', [Validators.required]);
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
      if (!this.firstNameFormControl.invalid.valueOf()
          && !this.lastNameFormControl.invalid.valueOf()
          && !this.addressFormControl.invalid.valueOf()
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
      if (!this.firstNameFormControl.dirty
          && !this.lastNameFormControl.dirty
          && !this.addressFormControl.dirty
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
              private sidebarService: SidebarLocatorService, public dialog: MdDialog) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.currentDriver.genderID=1;
      this.form = fb.group({
          firstNameFormControl: this.firstNameFormControl,
          lastNameFormControl: this.lastNameFormControl,
          addressFormControl: this.addressFormControl,
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
  }

private loadContractInfo(contractId: number) {
  this.contractService.getContractInfo(contractId.toString(), this.currentUser).subscribe(contract => {
    this.contractInfo = contract;
    if (this.contractInfo.isCompletedSuccessfully) {
      this.currentContract = this.contractInfo.result.currentContract;
      this.assignedDrivers = this.currentContract.assignedDrivers;
      this.assignedTrucks = this.currentContract.assignedTrucks;
      this.assignedFinanceAgreements = this.currentContract.assignedFinanceAgreements;

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
      }
    }
  }
}
selectNextContract() {
  for (var i = 0; i < this.contracts.length - 1; i++) {
    if (this.contracts[i].contractId == this.currentContract.contractId) {
      if (i != this.contracts.length - 1) {
        this.loadContractInfo(this.contracts[i + 1].contractId);
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
  
  findIndexToUpdate(newItem) {
      return newItem.driverEmailAddressID === this;
  }
  findDriverMedicalEvalutionIndexToUpdate(newItem) {
      return newItem.driverMedicalEvaluationID === this;
  }
  findMedicalProviderIndex(newItem) {
      return newItem.medicalProviderId === this;
  }
  findDriverInsuranceIndexToUpdate(newItem) {
      return newItem.driverInsuranceID === this;
  }
  findDriverContractIndexToUpdate(newItem) {
      return newItem.driverContractID === this;
  }
  findPhoneIndexToUpdate(newItem) {
      return newItem.driverPhoneID === this;
  }
  findPhoneTypeIndex(newItem) {
      return newItem.phoneNumberTypeId === this;
  }
  findDriverPhoneTypeIndex(newItem){
      return newItem.driverPhoneTypeID ===this;
  }

  findGenderTypeIndex(newItem) {
      return newItem.genderTypeId === this;
  }
  //#endregion


  //#region  Search driver
  //assignCopy() {
  //    this.filteredItems = Object.assign([], this.drivers);
  //}
  filterItem() {
      if (!this.driverFullName) this.assignCopy(); //when nothing has typed
      this.filteredItems = Object.assign([], this.drivers).filter(
          item => item.driverFullName.toString().toLowerCase().indexOf(this.driverFullName.toString().toLowerCase()) > -1
      )
      if (this.filteredItems.length == 0) {
          this.saveMessage = "Driver not found!!!";
          this.messageType = "info";
      }
      else {
          this.saveMessage = "";
          this.messageType = "info";
      }
      this.sidebar.ParseList(this.filteredItems, x => x.driverFullName, x => x.driverId);
  }

  //#endregion

  activeactiveChange(isActive: boolean) {
      if (isActive == true) {
          this.currentDriver.isActive = false;
      } else {
          this.currentDriver.isActive = true;
      }
  }
  
  private updatePhoneType() {
    this.driverPhones.forEach(element => {
        let updateItem = this.driverPhoneTypes.find(this.findPhoneTypeIndex, element.driverPhoneTypeID);
        if(updateItem!=undefined){
            element.driverPhoneType = updateItem.phoneNumberTypeName;
        }
    });
  }

  private getPhoneType(phoneTypeId: number): string {
      var phoneType: string;
      phoneType = "UNKNOWN";
      this.driverPhoneTypes.forEach(element => {
          if (element.phoneNumberTypeId == phoneTypeId) {
              let updateItem = this.driverPhoneTypes.find(this.findPhoneTypeIndex, element.phoneNumberTypeId);
              phoneType = updateItem.phoneNumberTypeName;
          }
      });
      return phoneType;
  }
  private getMedicalEvaluationProviderName(providerId: number): string {
      var phoneType: string;
      phoneType = "UNKNOWN";
      this.medicalProviders.forEach(element => {
          if (element.medicalProviderId == providerId) {
              let updateItem = this.medicalProviders.find(this.findMedicalProviderIndex, element.medicalProviderId);
              phoneType = updateItem.medicalProviderName;
          }
      });
      return phoneType;
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
  }


  private loadDriverInfo(driverId: number) {
      this.driverService.getDrivers(driverId.toString(), this.currentUser).subscribe(driver => {
          this.driverInfoModel = driver;
          if (this.driverInfoModel.isCompletedSuccessfully) {
              this.currentDriver = this.driverInfoModel.result.currentDriver;
              this.driverPhones = this.currentDriver.driverPhones;
              this.driverEmails = this.currentDriver.driverEmails;
              this.driverContracts = this.currentDriver.driverContracts;
              this.driverInsurances = this.currentDriver.driverInsurances;
              this.driverMedicalEvalutions = this.currentDriver.driverMedicalEvaluations;
              this.gender = this.getGenderName(this.currentDriver.genderID);

              this.updatePhoneType();
              this.saveMessage = "";
              this.messageType = "info";
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
  //#endregion
}

