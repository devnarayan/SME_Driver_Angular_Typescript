
import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Truck } from '../../_models/contract';

@Component({
  selector: 'assign.truck.dialog',
  templateUrl: 'assign.truck.dialog.html',
})
export class ContractTruckAssignDialog {
  contractFormControl = new FormControl('', [Validators.required]);
  contractStartDateFormControl = new FormControl('', [Validators.required]);
  message: string;
  truckList: Truck[] = [];

  getNameFunc = x => x.truckNumber;
  getValueFunc = x => x.truckId;

  constructor(
    public dialogRef: MdDialogRef<ContractTruckAssignDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    this.truckList = data.truckList;
  }

  onOkClick(): void {
    if (this.contractStartDateFormControl.invalid) {
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

