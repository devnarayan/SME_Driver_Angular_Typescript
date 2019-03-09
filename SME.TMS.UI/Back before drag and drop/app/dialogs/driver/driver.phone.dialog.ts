
import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { PhoneNumberType } from '../../_models/index';

@Component({
    selector: 'driver.phone.dialog',
    templateUrl: 'driver.phone.dialog.html',
})
export class DriverPhoneDialog {

    phoneFormControl = new FormControl('', [Validators.required, Validators.pattern('^([0-9]{3})?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$')]);
    message:string;
    driverPhoneTypes: PhoneNumberType[] = [];

    phoneTypeName = x => x.phoneNumberTypeName;
    phoneTypeValue = x => x.phoneNumberTypeId;
    constructor(
        public dialogRef: MdDialogRef<DriverPhoneDialog>,
        @Inject(MD_DIALOG_DATA) public data: any) {
        this.driverPhoneTypes = data.driverPhoneTypes;
    }
    onOkClick(): void {
        if (this.phoneFormControl.invalid) {
          this.message="Please provide required info.";
        }
        else {
          this.message="";
          this.dialogRef.close(this.data);
        }
      }

    onNoClick(): void {
        this.dialogRef.close();
    }
}