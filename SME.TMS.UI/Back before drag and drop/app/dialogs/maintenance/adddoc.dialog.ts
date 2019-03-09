
import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { ElementRef, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService, UploadService } from '../../_services/index';
import { User } from '../../_models/index';

@Component({
  selector: 'adddoc.dialog',
  templateUrl: 'adddoc.dialog.html',
})
export class AddDocDialog {
  docTitleFormControl = new FormControl('', [Validators.required]);
  message: string;

  form: FormGroup;
  loading: boolean = false;
  currentUser: User;

  @ViewChild('fileInput') fileInput: ElementRef;


  constructor(
    public dialogRef: MdDialogRef<AddDocDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _uploadService: UploadService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.createForm();
  }

  onOkClick(): void {
    if (this.docTitleFormControl.invalid) {
      this.message = "Please provide required info.";
    }
    else {
      this.message = "";
      this.dialogRef.close(this.data);
    }
  }

  createForm() {
    this.form = this.fb.group({
      name: [''],
      docfile: null
    });
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('docfile').setValue({
          filename: file.name,
          journalEntryID: this.data.journalEntryId,
          docTitle: this.data.doctitle,
          contentType: file.type,
          fileName:file.filename,
          fileData64String: reader.result.split(',')[1]
        })
      };
    }
  }

  onSubmit() {
    if (this.docTitleFormControl.invalid) {
      this.message = "Please provide required info.";
    }
    else {
      this.form.value.name = this.data.journalEntryId;
      const formModel = this.form.value;
      this.loading = true;

      // In a real-world app you'd have a http request / service call here like
      // this.http.post('apiUrl', formModel)
      //console.log(JSON.stringify(formModel))
      this._uploadService.saveRecurringDoc(this.currentUser, formModel).subscribe(
        image => {
          //this.imageUrl = image;
          console.log(image);
          this.loading = false;
          this.message = "";
          this.dialogRef.close(image);
        });
    }
  }

  clearFile() {
    this.form.get('docfile').setValue(null);
    this.fileInput.nativeElement.value = '';
    this.dialogRef.close();

  }

}

