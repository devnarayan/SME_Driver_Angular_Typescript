
import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DriverService } from '../../_services/index';
import { User, Invoice } from '../../_models/index';

@Component({
  selector: 'summary.billing.dialog',
  templateUrl: 'summary.billing.html',
})
export class SummaryBillingDialog {
  driverRateFormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);
  manuRateFormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);

  message: string;
  currentUser: User;
  summary: any;
  saveToModel: Invoice;
  constructor(
    public dialogRef: MdDialogRef<SummaryBillingDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.saveToModel = data.invoice;
    this.summary = Object.assign({}, data.invoice);
  }

  onOkClick(): void {
    if (this.driverRateFormControl.invalid ||
        this.manuRateFormControl.invalid) {
      this.message = "Please provide required info.";
    }
    else {
      Object.assign(this.saveToModel, this.summary);
      this.message = "";
      this.dialogRef.close(this.data);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

