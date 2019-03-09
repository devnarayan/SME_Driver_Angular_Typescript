
import { Component, Inject, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { MedicalProvider} from '../../_models/index';

@Component({
    selector: 'medical.history.dialog',
    templateUrl: 'medical.history.dialog.html',
  })
  export class MedicalEvaluationHistoryDialog {
    medicalHistoryFormControl = new FormControl('', [Validators.required, Validators.pattern('^([0-9]{3})?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$')]);
    message:string;
    driverMedicalProviders: MedicalProvider[] = [];
    constructor(
      public dialogRef: MdDialogRef<MedicalEvaluationHistoryDialog>,
      @Inject(MD_DIALOG_DATA) public data: any) {
        this.driverMedicalProviders=data.driverMedicalProviders;
       }
       onOkClick(): void {
        if (this.medicalHistoryFormControl.invalid) {
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
  
  