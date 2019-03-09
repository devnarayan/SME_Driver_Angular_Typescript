import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService, UploadService, JournalService } from '../../_services/index';
import { User, ImportExpenseModel, TruckDriverModel } from '../../_models/index';
import { DataTable, DataTableTranslations, DataTableResource } from 'angular-4-data-table-bootstrap-4';

@Component({
  selector: 'maptruckdriver.dialog',
  templateUrl: 'maptruckdriver.dialog.html',
})
export class MapTruckDriverDialog {
  message: string;
  loading: boolean = false;
  currentUser: User;
  driverSearch: string;

  driverResource = new DataTableResource([]);
  filmCount = 0;
  @ViewChild(DataTable) cashTable;

  driverList: TruckDriverModel[] = [];
  filteredItems: TruckDriverModel[] = [];

  constructor(
    public dialogRef: MdDialogRef<MapTruckDriverDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _uploadService: UploadService,
    private _journalService: JournalService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.driverResource.count().then(count => this.filmCount = count);
    this.getTruckDriver();
  }

  filterInvoice() {
    if (this.driverSearch.length == 0) {
      this.assignCashList();
    }
    else {
      this.filteredItems = Object.assign([], this.driverList).filter(
        item => ((item.truckNumber == null || item.truckNumber.toString().toLowerCase().indexOf(this.driverSearch.toString().toLowerCase()) > -1)
          || (item.driverName == null || item.driverName.toString().toLowerCase().indexOf(this.driverSearch.toString().toLowerCase()) > -1)
          || (item.contractName == null || item.contractName.toString().toLowerCase().indexOf(this.driverSearch.toString().toLowerCase()) > -1)
        )
      )
    }

    if (this.filteredItems.length == 0) {
      this.message = "Data not found!!!";
    }
    else {
      this.message = "";
    }
  }
  assignCashList() {
    this.filteredItems = Object.assign([], this.driverList);
  }


  clearFile() {
    this.dialogRef.close();
  }

  reloadInvoice(params) {
    this.driverResource.query(params).then(invoices => this.filteredItems = invoices);
  }

  selectTruckDriver(item: TruckDriverModel) {
    this.dialogRef.close(item);
  }
  private getTruckDriver() {
    this.loading = true;
    this._journalService.getTruckDriverList(this.currentUser).subscribe(
      data => {
        this.driverList = data;
        this.loading = false;
        this.message = "";

        this.assignCashList();
        this.driverResource = new DataTableResource(this.filteredItems);
        this.driverResource.count().then(count => this.filmCount = count);

      });
  }
  // special params:
  translations = <DataTableTranslations>{
    indexColumn: 'Index column',
    expandColumn: 'Expand column',
    selectColumn: 'Select column',
    paginationLimit: 'Max results',
    paginationRange: 'Result range'
  };

}

