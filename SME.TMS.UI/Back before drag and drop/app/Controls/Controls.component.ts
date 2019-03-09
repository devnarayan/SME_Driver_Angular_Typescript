import { Component, Input  } from '@angular/core';
import { Injectable }     from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map'


@Component({
  selector: 'app-root',
  templateUrl: './Controls.component.html',
  styleUrls: ['./Controls.component.css']
})
export class ControlesComponent {
  spaceScreens: Array<any>;

  myData: Array<any>;
 titlemy:string;
  constructor(private http:Http) {
    
    // this.http.get('assets/data.json')
    //   .map(response => response.json())
    //   .subscribe(res => this.myData = res);
  }

  likeMe(i) {
  

    if (this.myData[i].liked == NaN)
      this.myData[i].liked = 1;
    else
      this.myData[i].liked ++;
  }

  deleteMe(i) {
    this.myData.splice(i,1);
    console.log(i);
  }
}