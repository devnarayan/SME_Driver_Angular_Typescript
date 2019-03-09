import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FrequencyType } from '../_models/frequencyType';
import { MdDialog, MdSnackBar, MdSliderChange } from '@angular/material';
import { GlaccountListComponent } from '../glaccount-list/glaccount-list.component';
import { JournalService } from '../_services/jounral.service';
import { User } from '../_models/user';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SidebarLocatorService } from '../_services/sidebar-locator.service';
import { DriverList } from '../_models/driver';
import { MaintenanceService } from '../_services/index';
import { Commissions } from '../_models/commissions';

@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.css']
})
export class CommissionsComponent implements OnInit {

  driverNameControl: FormControl = new FormControl('', [Validators.required]);
  driverGLFormControl: FormControl = new FormControl('', [Validators.required]);
  smeGLFormControl: FormControl = new FormControl('', [Validators.required]);

  commissionsList: Commissions[] = [];
  currentCommission: Commissions;

  currentUser: User;

  private _index: number;

  constructor(private dialog: MdDialog, private maintenanceService: MaintenanceService,
            private sidebarLocator: SidebarLocatorService, private snackbar: MdSnackBar) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.commissionsList = [];
    this.currentCommission = <Commissions>{};
  }

  ngOnInit() {
   // this.maintenanceService.getCommissionsList(this.currentUser).subscribe(result => {
   //   this.commissionsList = result.json().commissionsList;
   //   if(this.commissionsList.length > 0){
   //     this.currentCommission = this.commissionsList[0];
   //   }
   //   else{
   //     this.addCommission();
   //   }
   // });
  }

  selectPrevCommission() {
    const currIndex = this.commissionsList.indexOf(this.currentCommission);
    if(currIndex > 0){
      this.currentCommission = this.commissionsList[currIndex - 1];
    }
  }

  selectNextCommission() {
    const currIndex = this.commissionsList.indexOf(this.currentCommission);
    if(currIndex < this.commissionsList.length - 1){
      this.currentCommission = this.commissionsList[currIndex + 1];
    }
  }

  saveCommissions(){
    this._index = this.commissionsList.indexOf(this.currentCommission);
    this.maintenanceService.saveCommissionsList(this.currentUser, this.commissionsList)
      .subscribe(result => {
        const snackbarRef = this.snackbar.open('Save Completed', 'Dismiss');
        this.commissionsList = result.json().commissions;
        if(this.commissionsList.length > 0){
          if(this.commissionsList.length > this._index){
            this.currentCommission = this.commissionsList[this._index];
          }
          else {
            this.currentCommission = this.commissionsList[0];
          }
        }
        else{
          this.addCommission();
        }
      },
    error => {
      const snackbarRef = this.snackbar.open(error.status + ': ' + error.json().Message, 'Dismiss');
    });
  }

  addCommission() {
    const  newCommission = <Commissions>{
      commissionId: 0
    };

    this.commissionsList.push(newCommission);
    this.currentCommission = newCommission;

  }
}

