import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { User } from '../_models/index';
import { AuthenticationService } from '../_services/index';
import { SidebarLocatorService } from '../_services/sidebar-locator.service';

@Component({
  selector: 'app-maintenance-shell',
  templateUrl: './maintenance-shell.component.html',
  styleUrls: ['./maintenance-shell.component.css']
})
export class MaintenanceShellComponent implements OnInit {

  @ViewChild('sidebar') sidebar: SidebarComponent;
  @ViewChild('itemSidebar') itemSidear: SidebarComponent;
  public currentUser: User;
  public logoData = '';

  constructor(private router: Router, private authenicationServie: AuthenticationService, private sidebarService: SidebarLocatorService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.authenicationServie.getCurrentCompanyLogo().subscribe(response => {
      this.logoData = 'data:image/jpg;base64,' + response.json();
    });
  }

  ngOnInit() {
    const menuItems = [['Period', '/maintenance/period'],
                       ['Expense', '/maintenance/expense'],
                       ['Commissions', '/maintenance/commissions']];

    this.sidebar.ParseList(menuItems, x => x[0], x => x[1]);
    this.sidebar.LinkClicked(menuItems[0][1]);

    this.sidebarService.setSidebar(this.itemSidear);
  }

  SwitchSubpage(path: string){
    this.router.navigate([path]);
  }

  filterItem(){}

  ItemSelected(obj){

  }
}
