import {Component} from '@angular/core';


@Component({
  selector: 'select-example',
  templateUrl: 'select_example.html',
})
export class SelectFormExample {
  selectedValue: string;

  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
}