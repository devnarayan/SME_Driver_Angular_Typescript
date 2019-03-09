import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stringFilter'
})
export class StringFilter implements PipeTransform {
    transform(value: any[], getString: (any) => string, searchText: string) {
        if(!value){
            return [];
        }

        if(!getString){
            getString = (x) => x;
        }

        if(!searchText){
            return value;
        }

        searchText = searchText.toLowerCase();

        return value.filter(x => getString(x).toLowerCase().includes(searchText));
    }
}