
import { Component, Inject, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'confirm.dialog',
    templateUrl: 'confirm.dialog.html',
  })
  export class ConfirmDialog {
  
    constructor(
      public dialogRef: MdDialogRef<ConfirmDialog>,
      @Inject(MD_DIALOG_DATA) public data: any) { }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }
  
  