import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ElementRef, ViewChild, Input } from '@angular/core';
import { User, TemplateDefinitionModel, TruckDriverModel } from '../../_models/index';
import { UserService, DriverService, ContractService, UploadService, JournalService } from '../../_services/index';
import { SidebarLocatorService } from '../../_services/sidebar-locator.service';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ImportExpenseModel } from '../../_models/index';
import { DataTable, DataTableTranslations, DataTableResource } from 'angular-4-data-table-bootstrap-4';
import { Jsonp } from '@angular/http/src/http';
import { fadeInContent } from '@angular/material/typings/select/select-animations';
import { MassEntryImportDialog } from '../../dialogs/maintenance/massentryimport';
import { MapTruckDriverDialog } from '../../dialogs/maintenance/maptruckdriver.dialog';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-massentry',
  templateUrl: './massentry.component.html',
  styleUrls: ['./massentry.component.css']
})

export class MassentryComponent implements OnInit {
  private baseUrl: Observable<string>;
  currentUser: User;
  currentContractId: number;
  sidebar: SidebarComponent;
  saveMessage: string;
  selectedTemplateId: number;
  templateList: TemplateDefinitionModel[] = [];
  currentTemplate: TemplateDefinitionModel;
  currentImport: TruckDriverModel;

  loading: boolean = false;
  messageType: string;
  importList: ImportExpenseModel[] = [];
  filterCashList: ImportExpenseModel[] = [];

  invoiceResource = new DataTableResource([]);
  filmCount = 0;

  @ViewChild(DataTable) cashTable;

  constructor(
    private http: Http,
    private userService: UserService,
    private driverService: DriverService,
    private contractService: ContractService,
    private _uploadService: UploadService,
    private _journalService: JournalService,
    private sidebarService: SidebarLocatorService, public dialog: MdDialog) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    http.get('assets/config.json').map(x => x.json().baseUrl).subscribe(
      data => {
        this.baseUrl = data;
      });
  }

  ngOnInit() {
    this.sidebar = this.sidebarService.getSidebar();
    this.sidebar.OnClicked.asObservable().subscribe(param => {
      this.currentContractId = param;
    }
    );
    this.getTempDefinition(0);
  }

  assignImportList() {
    this.filterCashList = Object.assign([], this.importList);
  }

  changeTemplate(temp: TemplateDefinitionModel) {
    this.currentTemplate = temp;
    this.selectedTemplateId = this.currentTemplate.templateDefinitionId;
  }

  mapTruckDriverDialog(item: ImportExpenseModel) {
    let driverDialogRef = this.dialog.open(MapTruckDriverDialog, {
      width: '600px',
      height: '550px',
      data: {
        title: 'Map Truck Driver',
        cash: item
      }
    });

    driverDialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.currentImport = result;
        // Update info to push in database.
        this.importList.forEach(importItem => {
          if (importItem.importedExpenseId == item.importedExpenseId) {
            importItem.driverId = this.currentImport.driverId;
            importItem.contractId = this.currentImport.contractId;
            importItem.truckId = this.currentImport.truckId;

            importItem.driverName = this.currentImport.driverName;
            importItem.contractName = this.currentImport.contractName;
            importItem.truckNumber = this.currentImport.truckNumber;

            this.assignImportList();
          }
        });

      }
    });
  }

  reloadInvoice(params) {
    this.invoiceResource.query(params).then(invoices => this.filterCashList = invoices);
  }

  // special params:
  translations = <DataTableTranslations>{
    indexColumn: 'Index column',
    expandColumn: 'Expand column',
    selectColumn: 'Select column',
    paginationLimit: 'Max results',
    paginationRange: 'Result range'
  };

  private getTempDefinition(vendorId: number) {
    this.loading = true;
    this.selectedTemplateId = undefined;
    this._journalService.getTemplateDefinition(this.currentUser, vendorId).subscribe(
      data => {
        this.templateList = data;
        this.loading = false;
        if (this.templateList.length > 0) {
          this.currentTemplate = this.templateList[0];
          this.selectedTemplateId = this.currentTemplate.templateDefinitionId;
        }
      });
  }

  importData(): void {
    alert(this.currentTemplate.templateDefinitionId);
    let docDialogRef = this.dialog.open(MassEntryImportDialog, {
      width: '400px',
      height: '260px',
      data: { title: 'Import new document.', templateDefinitionId: this.currentTemplate.templateDefinitionId }
    });

    docDialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.importList = result;
        console.log(JSON.stringify(this.importList));
        this.assignImportList();
        this.saveMessage = "";
        this.messageType = "info";

        this.invoiceResource = new DataTableResource(this.filterCashList);
        this.invoiceResource.count().then(count => this.filmCount = count);
      }
    });
  }

  downloadTemplate(): void {
    this.loading = true;
    this._uploadService.downloadTemplate(this.currentTemplate.templateDefinitionId).subscribe(data => {
      this.loading = false;
    });
  }

  saveImportData(): void {
    this.loading = true;
    this._uploadService.saveImportDoc(this.currentUser, this.importList).subscribe(data => {
      this.loading = false;
      this.saveMessage = "Data saved successfully"
      this.getTempDefinition(0);
    });
  }
}

