import { Injectable } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Injectable()
export class SidebarLocatorService {

  private currentSidebar: SidebarComponent;

  constructor() { }

  public setSidebar(sidebar: SidebarComponent){
    this.currentSidebar = sidebar;
  }

  public getSidebar(): SidebarComponent{
    return this.currentSidebar;
  }

}
