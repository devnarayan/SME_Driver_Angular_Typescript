
import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService, UploadService } from '../_services/index';
import { User } from '../_models/index';
@Component({
    selector: 'base64-upload',
    templateUrl: 'base64-upload.component.html'
})
export class Base64UploadComponent {
    @Input() userId: string;
    @Input() imageUrl:string;

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
            name: [''],
            avatar: null
        });
    }

    onFileChange(event) {
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.form.get('avatar').setValue({
                    filename: file.name,
                    filetype: file.type,
                    value: reader.result.split(',')[1]
                })
            };
        }
    }

    onSubmit() {
        this.form.value.name = this.userId;
        const formModel = this.form.value;
        this.loading = true;
        // In a real-world app you'd have a http request / service call here like
        // this.http.post('apiUrl', formModel)
        this._uploadService.saveRecurringDoc(this.currentUser, formModel).subscribe(
            image => {
                //this.imageUrl = image;
                console.log(image);
                this.loading = false;
            });
    }

    clearFile() {
        this.form.get('avatar').setValue(null);
        this.fileInput.nativeElement.value = '';
    }
}