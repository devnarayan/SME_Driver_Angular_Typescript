import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { User } from '../_models/index';
import { AuthenticationService, DriverService } from '../_services/index';
import { SidebarLocatorService } from '../_services/sidebar-locator.service';
import { DriverList } from '../_models/driver';


@Component({
  selector: 'app-report-shell',
  templateUrl: './report-shell.component.html',
  styleUrls: ['./report-shell.component.css']
})
export class ReportShellComponent implements OnInit {
  @ViewChild('sidebar') sidebar: SidebarComponent;
  @ViewChild('itemSidebar') itemSidebar: SidebarComponent;
  public currentUser: User;
  public logoData = '';

  constructor(private router: Router, private authenicationServie: AuthenticationService, 
            private sidebarService: SidebarLocatorService, private driverService: DriverService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.authenicationServie.getCurrentCompanyLogo().subscribe(response => {
      this.logoData = 'data:image/jpg;base64,' + response.json();
    });
  }

  ngOnInit() {
    this.sidebarService.setSidebar(this.itemSidebar);
    const menuItems = [['Report 1', '/report/report1'],
                       ['Report 2', '/report/report2'],
                       ['Report 3', '/report/report3']];

    this.sidebar.ParseList(menuItems, x => x[0], x => x[1]);
    this.sidebar.LinkClicked(menuItems[0][1]);
  }

  SwitchSubpage(path: string){
    //this.itemSidebar.Clear();
    this.router.navigate([path]);
  }
  filterItem(){}

  ItemSelected(obj){

  }
}