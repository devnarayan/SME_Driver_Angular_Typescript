import { Component, ViewChild } from '@angular/core';
import { DataTable, DataTableTranslations, DataTableResource } from 'angular-4-data-table-bootstrap-4';
import { cash } from './data-table-cash-data';


@Component({
  selector: 'data-table-cash',
  templateUrl: './data-table-cash.html',
  styleUrls: ['./data-table-cash.css']
})
export class DataTableCash {

    filmResource = new DataTableResource(cash);
    cash = [];
    filmCount = 0;

    @ViewChild(DataTable) cashTable;

    constructor() {
        this.filmResource.count().then(count => this.filmCount = count);
    }

    reloadFilms(params) {
        this.filmResource.query(params).then(films => this.cash = films);
    }

    cellColor(car) {
        return 'rgb(255, 255,' + (155 + Math.floor(100 - ((car.rating - 8.7)/1.3)*100)) + ')';
    };

    // special params:

    translations = <DataTableTranslations>{
        indexColumn: 'Index column',
        expandColumn: 'Expand column',
        selectColumn: 'Select column',
        paginationLimit: 'Max results',
        paginationRange: 'Result range'
    };
}
