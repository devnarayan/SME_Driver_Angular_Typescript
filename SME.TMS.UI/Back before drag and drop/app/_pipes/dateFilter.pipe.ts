import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateFilter',
    pure: false
})
export class DateFilter implements PipeTransform {
    transform(items: any[], getDate: (any) => Date, filterDate: Date, lessThan: boolean): any {
        if (!items || !getDate || !filterDate) {
            return items;
        }
        
        if(lessThan){
            return items.filter(item => this.ensureDate(getDate(item)) <= filterDate);
        }
        else{
            return items.filter(item => this.ensureDate(getDate(item)) >= filterDate);
        }
    }

    ensureDate(date: any): Date{
        return new Date(date);
    }
}