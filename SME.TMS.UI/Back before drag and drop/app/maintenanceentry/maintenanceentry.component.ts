import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    User, DriverInfoModel, DriverInfoResult, DriverModel, DriverList, CurrentDriver, 
    DriverEmail, DriverMedicalEvaluation, DriverInsurance, DriverContract, DriverPhone,
    PhoneNumberType, StateProvince, GenderType, InsuranceProvider, MedicalProvider, LookupRootObject
} from '../_models/index';
import { DriverService } from '../_services/index';
import { UserService, ContractService } from '../_services/index';
import { TestDialog } from '../dialogs/test.dialog';
import { DriverEmailDialog } from '../dialogs/driver/driver.email.dialog';
import { DriverPhoneDialog } from '../dialogs/driver/driver.phone.dialog';
import { ConfirmDialog } from '../dialogs/confirm.dialog';
import { ContractHistoryDialog } from '../dialogs/driver/contract.history.dialog';
import { InsuranceHistoryDialog } from '../dialogs/driver/insurance.history.dialog';
import { MedicalEvaluationHistoryDialog } from '../dialogs/driver/medical.history.dialog';
import { SidebarLocatorService } from '../_services/sidebar-locator.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {
    ContractRootObject, ContractListModel, ContractList, ContractLookupModel, FinanceType, Truck, CurrentContract,
    AssignedDriver, AssignedTruck, AssignedFinanceAgreement, CommonFunction
  } from '../_models/contract';
declare var jquery:any;
declare var $ :any;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-maintenanceentry',
  templateUrl: './maintenanceentry.component.html',
  styleUrls: ['./maintenanceentry.component.css']
})

export class MaintenanceentryComponent implements OnInit {
  driverInfoModel: DriverInfoModel;
  currentDriver: CurrentDriver = {};
  currentUser: User;
  drivers: DriverList[] = [];
  driverContracts: DriverContract[] = [];
  driverPhones: DriverPhone[] = [];
  driverModel: DriverModel;

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
  saveMessage: string;
  messageType: string;
  contractName: string;

  driverLookupModel: LookupRootObject;
  driverPhoneTypes: PhoneNumberType[] = [];
  driverGenderTypes: GenderType[] = [];
  stateProvinces: StateProvince[] = [];


  gender: string;
  //saveMessage: string;
  //messageType: string;
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
  constructor(fb: FormBuilder, private userService: UserService, 
              private sidebarService: SidebarLocatorService, private contractService: ContractService, private driverService: DriverService, public dialog: MdDialog) {
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

  findDriverContractIndexToUpdate(newItem) {
      return newItem.driverContractID === this;
  }

  findGenderTypeIndex(newItem) {
      return newItem.genderTypeId === this;
  }
  //#endregion


  //#region  Search driver
  assignCopy() {
      this.filteredItems = Object.assign([], this.contracts);
  }
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
  selectContract(contractId: number) {
    this.loadContractInfo(contractId);
}
}
