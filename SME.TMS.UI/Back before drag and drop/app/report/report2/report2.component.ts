import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { SidebarLocatorService } from '../../_services/sidebar-locator.service';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
    selector: 'report2.component',
    templateUrl: './report2.component.html',
    styleUrls: ['./report2.component.css']
  })
  export class Report2Component {
    public currentUser: User;
    public logoData = '';
  
    constructor(private authenicationServie: AuthenticationService, 
            private sidebarService: SidebarLocatorService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.authenicationServie.getCurrentCompanyLogo().subscribe(response => {
      this.logoData = 'data:image/jpg;base64,' + response.json();
    });
  }
  
  ngOnInit() {
}

SwitchSubpage(path: string){
  //this.itemSidebar.Clear();
}
filterItem(){}

ItemSelected(obj){

}
  
  }
