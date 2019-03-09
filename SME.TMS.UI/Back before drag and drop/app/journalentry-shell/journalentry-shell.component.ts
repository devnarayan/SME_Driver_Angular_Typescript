import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { User } from '../_models/index';
import { UserService, ContractService } from '../_services/index';
import { AuthenticationService, DriverService } from '../_services/index';
import { SidebarLocatorService } from '../_services/sidebar-locator.service';
import { DriverList } from '../_models/driver';
import {
  ContractRootObject, ContractListModel, ContractList, ContractLookupModel, FinanceType, Truck, CurrentContract,
  AssignedDriver, AssignedTruck, AssignedFinanceAgreement, CommonFunction
} from '../_models/contract';

@Component({
  selector: 'app-journalentry-shell',
  templateUrl: './journalentry-shell.component.html',
  styleUrls: ['./journalentry-shell.component.css']
})
export class JournalEntryShellComponent implements OnInit {
  @ViewChild('sidebar') sidebar: SidebarComponent;
  @ViewChild('itemSidebar') itemSidebar: SidebarComponent;
  public currentUser: User;
  public logoData = '';

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

  constructor(private router: Router, private authenicationServie: AuthenticationService, 
            private sidebarService: SidebarLocatorService, private contractService: ContractService, private driverService: DriverService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.authenicationServie.getCurrentCompanyLogo().subscribe(response => {
      this.logoData = 'data:image/jpg;base64,' + response.json();
    });
  }

  ngOnInit() {
    this.sidebarService.setSidebar(this.itemSidebar);
    const menuItems = [['Adjustment Entry', '/journal/adjustment'],
                       ['Compliance Entry', '/journal/compliance'],
                       ['Expense Entry', '/journal/expense'],
                       ['Maintenance/Parts Entry', '/journal/maintenance'],
                       ['Recurring Entry', '/journal/recurring'],
                       ['Mass Entry', '/journal/mass']];

    this.sidebar.ParseList(menuItems, x => x[0], x => x[1]);
    this.sidebar.LinkClicked(menuItems[3][1]);

    //this.driverService.getDriverList(this.currentUser).subscribe(result => {
    //  this.itemSidebar.ParseList<DriverList>(result.driverList, x => x.driverFullName, x => x.driverId);
    //  this.itemSidebar.LinkClicked(result.driverList[0].driverId);
    this.loadContractList(0);
    this.loadContractLookup();
    };

  SwitchSubpage(path: string){
    //this.itemSidebar.Clear();
    this.router.navigate([path]);
  }
  filterItem(){}

  ItemSelected(obj){

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

  assignCopy() {
    this.filteredItems = Object.assign([], this.contracts);
  }

  private loadContractList(contractId: number) {
    this.contractService.getContractList(contractId.toString(), this.currentUser).subscribe(contractdata => {
      this.contractListObj = contractdata;
      this.contracts = this.contractListObj.contractList;
      this.itemSidebar.ParseList<ContractList>(this.contracts, (x) => x.contractName, (x) => x.contractId);
      this.loadContractInfo(this.contracts[0].contractId);
      this.assignCopy();
    });
  }

  private loadContractLookup() {
    this.contractService.getContractLookup(this.currentUser).subscribe(contractLookupdata => {
      this.contractLookupModel = contractLookupdata;
      this.financeTypeList = this.contractLookupModel.financeTypes;
      this.truckList = this.contractLookupModel.trucks;

      this.logoData = 'data:image/jpg;base64,' + this.contractLookupModel.logoData;
    });
  }
}