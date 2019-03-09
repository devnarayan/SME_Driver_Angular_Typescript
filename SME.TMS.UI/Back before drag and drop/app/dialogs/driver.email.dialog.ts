
import { Component, Inject, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'driver.email.dialog',
    templateUrl: 'driver.email.dialog.html',
  })
  export class DriverEmailDialog {
  
    constructor(
      public dialogRef: MdDialogRef<DriverEmailDialog>,
      @Inject(MD_DIALOG_DATA) public data: any) { }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }
  
  