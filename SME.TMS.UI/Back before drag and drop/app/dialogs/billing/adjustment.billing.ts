
import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DriverService } from '../../_services/index';
import { User, Invoice } from '../../_models/index';

@Component({
  selector: 'adjustment.billing.dialog',
  templateUrl: 'adjustment.billing.html',
})
export class AdjustmentBillingDialog {
  driverRateFormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);
  manuRateFormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);

  message: string;
  currentUser: User;
  invoiceModel: Invoice;
  saveToModel: Invoice;
  constructor(
    public dialogRef: MdDialogRef<AdjustmentBillingDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.saveToModel = data.invoice;
    this.invoiceModel = Object.assign({}, data.invoice);
  }

  onOkClick(): void {
    if (this.driverRateFormControl.invalid ||
        this.manuRateFormControl.invalid) {
      this.message = "Please provide required info.";
    }
    else {
      Object.assign(this.saveToModel, this.invoiceModel);
      this.message = "";
      this.dialogRef.close(this.data);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

