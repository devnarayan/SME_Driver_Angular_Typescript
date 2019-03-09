import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Period } from '../_models/index';
import { MaintenanceService } from '../_services/index';
import { FrequencyType } from '../_models/frequencyType';
import { User } from '../_models/user';
import { GetPeriodLookupsResponse } from '../_responses/GetPeriodLookupsResponse';
import { MdSnackBar, MdDialog } from '@angular/material';
import { ConfirmDialog } from '../dialogs/confirm.dialog';
import { SnackbarService } from '../_services/snackbar.service';

@Component({
  selector: 'app-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.css']
})
export class PeriodComponent implements OnInit {

  constructor(private maintenanceService: MaintenanceService, private snackbar: SnackbarService,  private dialog: MdDialog) { 
    this.timeFilterList = [
      ["All", 0],
      ["3 Months", 3],
      ["6 Months", 6],
      ["12 Months", 12]
    ]
  }

  startDateFormControl = new FormControl('', [Validators.required]);
  endDateFormControl = new FormControl('', [Validators.required]);
  frequencyFormControl = new FormControl('', [Validators.required]);

  periodList: Period[] = [];

  startDate: Date;
  endDate: Date;
  frequencyTypeId: number;

  timeFilterList: [string, number][];
  currentFilter: number = 0;
  filterDate: Date;
  filterLamda = (x) => x.startDate;

  frequencyList: FrequencyType[] = [];

  currentUser: User;

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.maintenanceService.getPeriodLookups(this.currentUser).subscribe(response => {
        const obj = response.json() as GetPeriodLookupsResponse;
        this.frequencyList = obj.frequencyTypes;
    });

    this.maintenanceService.getPeriodList(this.currentUser).subscribe(response => {
        this.periodList = response.json().periods as Period[];
    });

    this.changeFilter();
  }

  save(){
    this.maintenanceService.savePeriodList(this.currentUser, this.periodList).subscribe(response => {
      this.snackbar.createSnackbar('Save Completed');

      this.periodList = response.json().periods as Period[];
    },
      error => {
        this.snackbar.createSnackbar(error.status + ': ' + error.json().Message);
      });
  }

  deletePeriod(item){
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Are you sure you want to delete this period?'
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      const index = this.periodList.indexOf(item);

      if(result !== undefined){
        if(this.periodList[index].periodId !== 0){
          this.periodList[index].isDeleted = true;
          this.save();
        }
      }
    });
  }

  build(){
    if(this.startDate > this.endDate){
      this.snackbar.createSnackbar('Start Date must be less than End Date');
      return;
    }

    if(this.frequencyFormControl.hasError('required') ||
       this.startDateFormControl.hasError('required') ||
       this.endDateFormControl.hasError('required')){
        this.snackbar.createSnackbar('Please fill all required fields.');
      return;
    }

    this.maintenanceService.buildPeriodList(this.currentUser, this.frequencyTypeId, this.startDate, this.endDate).subscribe(response => {
      this.snackbar.createSnackbar('Save Completed');

      this.periodList = response.json().periods as Period[];
    },
      error => {
        this.snackbar.createSnackbar(error.status + ': ' + error.json().Message);
      });
  }

  changeFilter(){
    if(this.currentFilter === 0){
      this.filterDate = new Date(-8640000000000000);
    }
    else{
      this.filterDate = new Date();
      this.filterDate.setMonth(this.filterDate.getMonth() - this.currentFilter);
    }

    this.periodList = this.periodList;
  }
}