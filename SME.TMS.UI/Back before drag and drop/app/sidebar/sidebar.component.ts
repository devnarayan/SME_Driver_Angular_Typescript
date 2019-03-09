import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['sidebar.component.css']
})
export class SidebarComponent {
    @Input()public itemList: [any, any][];
    @Output()OnClicked = new EventEmitter<any>();

    private selectedItem: any;
    private filterString: string;
    private filterLambda = (x) => x[0];

    LinkClicked(obj){
        this.selectedItem = obj;
        this.OnClicked.emit(obj);
    }

    ParseList<T>(list: T[], getKey: (T) => string, getValue: (T) => number) {
        this.Clear();
        for (let i = 0; i < list.length; i++){
          this.Append<T>(list[i], getKey, getValue);
        }
        if(this.itemList.length > 0) {
            this.selectedItem = this.itemList[0][1];
        }
      }

      Append<T>(item: T, getKey: (T) => string, getValue: (T) => number){
        this.itemList[this.itemList.length] = [getKey(item), getValue(item)];
      }

      Clear(){
          this.itemList = [];
      }

      GetSelectedValue(){
        if(this.selectedItem)
        {
          return this.selectedItem;
        } else
        {
            return null;
        }
      }

      GetSelectedKey(){
          if(this.selectedItem)
          {
            const index = this.itemList.findIndex(x => x[1] === this.selectedItem);
            if(index >= 0){
                return this.itemList[index][0];
            } else{
                return null;
            }
          } else
          {
              return null;
          }
      }

      @Input()
      get filter(): string{
          return this.filterString;
      }

      set filter(filter: string){
          this.filterString = filter;
      }

      get lambda(): (any) => string {
          return this.filterLambda;
      }

      clearFilter() {
          this.filterString = '';
      }

      private isActive(item: any){
          return this.selectedItem && item === this.selectedItem;
      }
}


