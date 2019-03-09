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
import { ExpenseType } from '../_models/maintenance';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {

  nameFormControl: FormControl = new FormControl('', [Validators.required]);
  automationFormControl: FormControl = new FormControl('', [Validators.required]);
  driverGLFormControl: FormControl = new FormControl('', [Validators.required]);
  sMEGLFormControl: FormControl = new FormControl('', [Validators.required]);
  frequencyFormControl: FormControl = new FormControl('', [Validators.required]);

  expenseList: ExpenseType[] = [];
  currentExpense: ExpenseType;

  frequencyList: FrequencyType[];

  currentUser: User;

  private _index: number;

  constructor(private dialog: MdDialog, private maintenanceService: MaintenanceService,
    private sidebarLocator: SidebarLocatorService, private snackbar: MdSnackBar) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.expenseList = [];
    this.currentExpense = <ExpenseType>{};
  }

  ngOnInit() {
    this.maintenanceService.getPeriodLookups(this.currentUser).subscribe(result => {
      const obj = result.json();
      this.frequencyList = obj.frequencyTypes;
    });

    this.maintenanceService.getExpenseTypeList(this.currentUser).subscribe(result => {
      this.expenseList = result.json().expenseTypes;
      if (this.expenseList.length > 0) {
        this.currentExpense = this.expenseList[0];
      }
      else {
        this.addExpense();
      }
    });
  }

  selectPrevExpense() {
    const currIndex = this.expenseList.indexOf(this.currentExpense);
    if (currIndex > 0) {
      this.currentExpense = this.expenseList[currIndex - 1];
    }
  }

  selectNextExpense() {
    const currIndex = this.expenseList.indexOf(this.currentExpense);
    if (currIndex < this.expenseList.length - 1) {
      this.currentExpense = this.expenseList[currIndex + 1];
    }
  }

  addExpense() {
    const newExpense = <ExpenseType>{
      expenseTypeID: 0
    };

    this.expenseList.push(newExpense);
    this.currentExpense = newExpense;

  }

  openModal(type) {
    const dialogRef = this.dialog.open(GlaccountListComponent, { data: type, width: '500px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (type === 'driver') {
          this.currentExpense.driverGLAccount = result;
        } else {
          this.currentExpense.companyGLAccount = result;
        }
      }
    });
  }

  saveExpenses() {
    this._index = this.expenseList.indexOf(this.currentExpense);
    this.maintenanceService.saveExpenseTypeList(this.currentUser, this.expenseList)
      .subscribe(result => {
        const snackbarRef = this.snackbar.open('Save Completed', 'Dismiss');
        this.expenseList = result.json().expenseTypes;
        if (this.expenseList.length > 0) {
          if (this.expenseList.length > this._index) {
            this.currentExpense = this.expenseList[this._index];
          }
          else {
            this.currentExpense = this.expenseList[0];
          }
        }
        else {
          this.addExpense();
        }
      },
      error => {
        const snackbarRef = this.snackbar.open(error.status + ': ' + error.json().Message, 'Dismiss');
      });
  }

  updateContribution(event: MdSliderChange) {
    this.currentExpense.driverPercent = 100.0 - event.value;
  }

}
