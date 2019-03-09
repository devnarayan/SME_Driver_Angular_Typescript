
import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DriverService } from '../../_services/index';
import { User, Invoice } from '../../_models/index';

@Component({
  selector: 'invoice.billing.dialog',
  templateUrl: 'invoice.billing.dialog.html',
})
export class InvoiceBillingDialog {

  trackingIdFormControl = new FormControl('', [Validators.required]);
  loanNumberFormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);
  driverRateFormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);
  driverFSCFormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);
  manuRateFormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);
  manuFSCFormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);

  terminalFormControl = new FormControl('', [Validators.required]);
  deliveryDateFormControl = new FormControl('', [Validators.required]);
  trucknumberFormControl = new FormControl('', [Validators.required]);

  message: string;
  currentUser: User;
  invoiceModel: Invoice;
  saveToModel: Invoice;

  constructor(
    public dialogRef: MdDialogRef<InvoiceBillingDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.saveToModel = data.invoice;
    this.invoiceModel = Object.assign({}, data.invoice);
  }

  onOkClick(): void {
    if (this.deliveryDateFormControl.invalid ||
        this.trackingIdFormControl.invalid ||
        this.loanNumberFormControl.invalid ||
        this.driverRateFormControl.invalid ||
        this.driverFSCFormControl.invalid ||
        this.manuFSCFormControl.invalid ||
        this.manuRateFormControl.invalid ||
        this.terminalFormControl.invalid ||
        this.trucknumberFormControl.invalid) {
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

