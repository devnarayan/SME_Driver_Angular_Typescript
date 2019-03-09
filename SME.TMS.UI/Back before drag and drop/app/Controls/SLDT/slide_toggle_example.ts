import {Component} from '@angular/core';


@Component({
  selector: 'slide-toggle-example',
  templateUrl: 'slide_toggle_example.html',
  styleUrls: ['slide_toggle_example.css'],
})
export class SlideToggleConfigurableExample {
  color = 'accent';
  checked = false;
  disabled = false;
}