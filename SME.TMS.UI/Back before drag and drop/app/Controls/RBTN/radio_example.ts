import {Component} from '@angular/core';


@Component({
  selector: 'radio-example',
  templateUrl: 'radio_example.html',
  styleUrls: ['radio_example.css'],
})
export class RadioNgModelExample {
  favoriteSeason: string;

  seasons = [
    'Winter',
    'Spring',
    'Summer',
    'Autumn',
  ];
}