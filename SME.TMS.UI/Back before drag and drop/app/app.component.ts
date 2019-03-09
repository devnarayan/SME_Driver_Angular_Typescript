import { Component, Input  } from '@angular/core';
import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  spaceScreens: Array<any>;

  myData: Array<any>;
  titlemy: string;
  constructor(private http: Http, private router: Router) {
  }
}
