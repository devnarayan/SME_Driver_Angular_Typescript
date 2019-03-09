import { CanDeactivate } from '@angular/router';
import { FormGroup }     from '@angular/forms';
import { HomeComponent } from './home/index';
export interface FormComponent {
    form: FormGroup;
}

export class PreventUnsavedChangesGuard implements CanDeactivate<HomeComponent> {
    canDeactivate(component: HomeComponent) {
       // alert(component.firstNameFormControl.dirty);
        if (component.form.dirty)
            return confirm('You have unsaved changes. Are you sure you want to navigate away?');

        return true;
    } 
}