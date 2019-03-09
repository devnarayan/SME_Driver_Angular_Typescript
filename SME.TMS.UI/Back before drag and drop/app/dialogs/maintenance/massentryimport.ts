
import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { ElementRef, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService, UploadService } from '../../_services/index';
import { User } from '../../_models/index';

@Component({
    selector: 'massentryimport',
    templateUrl: 'massentryimport.html',
})
export class MassEntryImportDialog {
    message: string;

    form: FormGroup;
    loading: boolean = false;
    currentUser: User;

    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(
        public dialogRef: MdDialogRef<MassEntryImportDialog>,
        @Inject(MD_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private _uploadService: UploadService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.createForm();
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
                    journalEntryID: this.data.templateDefinitionId,
                    contentType: file.type,
                    fileName: file.filename,
                    fileData64String: reader.result.split(',')[1]
                })
            };
        }
    }

    onSubmit() {

        this.form.value.name = this.data.journalEntryId;
        const formModel = this.form.value;
        this.loading = true;

        this._uploadService.importCSVDoc(this.currentUser, formModel).subscribe(importList => {
            this.loading = false;
            this.message = "";
            this.dialogRef.close(importList);
        });
    }

    clearFile() {
        this.form.get('docfile').setValue(null);
        this.fileInput.nativeElement.value = '';
        this.dialogRef.close();
    }

}

