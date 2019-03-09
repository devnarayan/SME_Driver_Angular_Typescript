import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService, UploadService } from '../_services/index';
import { User } from '../_models/index';

@Component({
    selector: 'formdata-upload',
    templateUrl: 'fileupload.component.html'
})
export class FormdataUploadComponent {
    form: FormGroup;
    loading: boolean = false;
    currentUser: User;

    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(private fb: FormBuilder, private _uploadService: UploadService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            name: ['', Validators.required],
            avatar: null
        });
    }

    onFileChange(event) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            this.form.get('avatar').setValue(file);
        }
    }

    private prepareSave(): any {
        let input = new FormData();
        input.append('name', this.form.get('name').value);
        input.append('avatar', this.form.get('avatar').value);
        return input;
    }

    onSubmit() {
        const formModel = this.prepareSave();
        this.loading = true;
        // In a real-world app you'd have a http request / service call here like
        //this.http.post('apiUrl', formModel)
        this._uploadService.saveRecurringDoc(this.currentUser, formModel)
            .subscribe(
            data => {
                this.loading = false;
            },
            error => {
                this.loading = false;
            });

        setTimeout(() => {
            // FormData cannot be inspected (see "Key difference"), hence no need to log it here
            alert('done!');
            this.loading = false;
        }, 1000);
    }

    clearFile() {
        this.form.get('avatar').setValue(null);
        this.fileInput.nativeElement.value = '';
    }
}