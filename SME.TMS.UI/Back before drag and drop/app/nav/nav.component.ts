import { Component, Output, EventEmitter, Input } from '@angular/core';
import { User } from '../_models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  @Output() public filterChange = new EventEmitter<string>();
  public filterString: string;
  @Input() public currentUser: User;
  @Input() logo = '';
  @Input() Active = '';

  @Input()
  get filter() {
    return this.filterString;
  }

  set filter(val){
    this.filterString = val;
    this.filterChange.emit(this.filterString);
  }
}
