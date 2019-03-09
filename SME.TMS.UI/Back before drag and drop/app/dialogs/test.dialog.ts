
import { Component, Inject, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'test.dialog',
    templateUrl: 'test.dialog.html',
  })
  export class TestDialog {
  
    constructor(
      public dialogRef: MdDialogRef<TestDialog>,
      @Inject(MD_DIALOG_DATA) public data: any) { }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }
  
  