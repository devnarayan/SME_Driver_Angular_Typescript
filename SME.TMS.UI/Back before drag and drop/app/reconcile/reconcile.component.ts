import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user';
import { UserService, ContractService } from '../_services/index';
import {
  ContractRootObject, ContractListModel, ContractList, ContractLookupModel, FinanceType, Truck, CurrentContract,
  AssignedDriver, AssignedTruck, AssignedFinanceAgreement, CommonFunction
} from '../_models/contract';
import { DataSource, CollectionViewer } from '@angular/cdk';
import { Observable } from 'rxjs/Observable';
import { DataTableTranslations, DataTableResource } from 'angular-4-data-table-bootstrap-4';
import { BillingService } from '../_services/index';
import { DriverService } from '../_services/driver.service';
import { Invoice, DriverList } from '../_models/index';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { InvoiceBillingDialog } from '../dialogs/billing/invoice.billing.dialog';
import { MdDialog } from '@angular/material';
import { CommissionBillingDialog } from '../dialogs/billing/commission.billing.dialog';
import { AdjustmentBillingDialog } from '../dialogs/billing/adjustment.billing';
import { SummaryBillingDialog } from '../dialogs/billing/summary.billing';

@Component({
  selector: 'app-reconcile',
  templateUrl: './reconcile.component.html',
  styleUrls: ['./reconcile.component.css']
})
export class ReconcileComponent implements OnInit {

  public currentUser: User;
  public logoData = '';
  public commissionData: DataTableResource<Invoice>;
  public filteredCommissionData: Invoice[];
  public summaryData: SummaryTemp[];
  public adjustmentData: AdjustmentTemp[];
  public translations: DataTableTranslations;
  public filterString: string;

  public driverList: DriverList[];

  contracts: ContractList[] = [];
  filteredItems: ContractList[] = [];
  contractListObj: ContractListModel;
  contractLookupModel: ContractLookupModel;
  currentContract: CurrentContract = {};
  assignedDrivers: AssignedDriver[] = [];
  assignedTrucks: AssignedTruck[] = [];
  assignedFinanceAgreements: AssignedFinanceAgreement[] = [];
  saveMessage: string;
  messageType: string;
  contractInfo: ContractRootObject;
  financeTypeList: FinanceType[] = [];
  truckList: Truck[] = [];

  @ViewChild(SidebarComponent) sidebar: SidebarComponent;

  constructor(private authenicationServie: AuthenticationService,
    private billingService: BillingService,
    private driverService: DriverService,
    private contractService: ContractService,
    public dialog: MdDialog) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.authenicationServie.getCurrentCompanyLogo().subscribe(response => {
      this.logoData = 'data:image/jpg;base64,' + response.json();
    });

    this.commissionData = new DataTableResource([]);;
    this.filteredCommissionData = [];
    this.summaryData = [];
    this.adjustmentData = [];
    this.driverList = [];
    this.translations = <DataTableTranslations>{
      indexColumn: 'Index column',
      expandColumn: 'Expand column',
      selectColumn: 'Select column',
      paginationLimit: 'Max results',
      paginationRange: 'Result range'
    };

    this.filterString = '';
  }

  ngOnInit() {
    this.loadContractList(0);
    this.loadContractLookup();
//    this.driverService.getDriverList(this.currentUser).subscribe(result => {
//      this.driverList = result.driverList;
//      this.sidebar.ParseList(this.driverList, x => x.driverFullName, x => x.driverId);
//      this.sidebar.LinkClicked(this.driverList[0].driverId);

    this.adjustmentData[0] = <AdjustmentTemp>{
      load: 7894,
      deliveryDate: new Date(),
      fuelSurcharge: 1364.13,
      rate: 13.7,
      terminal: '99',
      truck: '101',
      vin: 'JKH2345GH8913GG37'
    };

    this.summaryData[0] = <SummaryTemp>{
      adjustments: 0,
      amount: 9000,
      comm: 17566,
      driver: 'David Banner',
      expenses: 8566,
      loadCount: 17,
      state: 'Approved',
      truck: '445',
      vinCount: 150
    }
  }

  ItemSelected(obj) {
    this.billingService.getCommissionsList(this.currentUser, obj).subscribe(result => {
      this.commissionData = new DataTableResource(result.invoices);
      this.reloadCommissionTable('');
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

      this.logoData = 'data:image/jpg;base64,' + this.contractLookupModel.logoData;
    });
  }

  assignCopy() {
    this.filteredItems = Object.assign([], this.contracts);
  }

  editInvocieDialog(item: Invoice) {
    const driverDialogRef = this.dialog.open(CommissionBillingDialog, {
        width: '550px',
        height: '550px',
        data: {
            title: 'Update Commissionng Detail',
            invoice: item
        }
    });
  }

  editExpenseDialog(item: any){
    console.log(item);
  }

  editAdjustmentDialog(item: AdjustmentTemp){
    const invoiceTemp = Object.assign(new Invoice(), {
      deliveryDate: item.deliveryDate,
      dispatchLoadNumber: item.load,
      driverFuelSurcharge: item.fuelSurcharge,
      driverRate: item.rate,
      terminal: item.terminal,
      truckNumber: item.truck,
      trackingIdNumber: item.vin
    });

    const driverDialogRef = this.dialog.open(AdjustmentBillingDialog, {
      width: '550px',
      height: '550px',
      data: {
          title: 'Update Commissionng Detail',
          invoice: invoiceTemp
      }
    });
  }

  editSummaryDialog(item: any){
    const driverDialogRef = this.dialog.open(SummaryBillingDialog, {
      width: '550px',
      height: '550px',
      data: {
          title: 'Update Commissionng Detail',
          invoice: item
      }
    });
  }

  reloadCommissionTable(param){
    this.commissionData.query(param).then(x => this.filteredCommissionData = x);
  }
}

export class SummaryTemp {
  public driver: string;
  public vinCount: number;
  public loadCount: number;
  public comm: number;
  public expenses: number;
  public adjustments: number;
  public state: string;
  public amount: number;
  public truck: string;
}

export class AdjustmentTemp {
  public load: number;
  public vin: string;
  public rate: number;
  public fuelSurcharge: number;
  public terminal: string;
  public deliveryDate: Date;
  public truck: string;
}