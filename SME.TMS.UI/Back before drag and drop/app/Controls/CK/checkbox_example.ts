import {Component} from '@angular/core';


@Component({
  selector: 'checkbox-example',
  templateUrl: 'checkbox_example.html',
  styleUrls: ['checkbox_example.css'],
})
export class CheckboxConfigurableExample {
  checked = false;
  indeterminate = false;
  align = 'start';
  disabled = false;
}