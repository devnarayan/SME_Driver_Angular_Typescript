
import { Component, Inject, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { InsuranceProvider} from '../../_models/index';
@Component({
    selector: 'insurance.history.dialog',
    templateUrl: 'insurance.history.dialog.html',
  })
  export class InsuranceHistoryDialog {
    insuranceProviders: InsuranceProvider[] = [];
    constructor(
      public dialogRef: MdDialogRef<InsuranceHistoryDialog>,
      @Inject(MD_DIALOG_DATA) public data: any) {
        this.insuranceProviders = data.insuranceProviders;
       }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }
  
  