
import { Component, Inject, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


@Component({
    selector: 'driver.email.dialog',
    templateUrl: 'driver.email.dialog.html',
  })
  export class DriverEmailDialog {
    emailFormControl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);
    message:string;
    constructor(
      public dialogRef: MdDialogRef<DriverEmailDialog>,
      @Inject(MD_DIALOG_DATA) public data: any) { }
  
      onOkClick(): void {
        if (this.emailFormControl.invalid) {
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
  
  