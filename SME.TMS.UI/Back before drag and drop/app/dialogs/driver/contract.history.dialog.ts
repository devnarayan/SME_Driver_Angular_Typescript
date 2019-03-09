
import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DriverContract } from '../../_models/index';

@Component({
  selector: 'contract.history.dialog',
  templateUrl: 'contract.history.dialog.html',
})
export class ContractHistoryDialog {
  contractFormControl = new FormControl('', [Validators.required]);
  contractStartDateFormControl = new FormControl('', [Validators.required]);
  message: string;
  constructor(
    public dialogRef: MdDialogRef<ContractHistoryDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) {
  }
  onOkClick(): void {
    if (this.contractFormControl.invalid || this.contractStartDateFormControl.invalid) {
      this.message = "Please provide required info.";
    }
    else {
      this.message = "";
      this.dialogRef.close(this.data);
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}

