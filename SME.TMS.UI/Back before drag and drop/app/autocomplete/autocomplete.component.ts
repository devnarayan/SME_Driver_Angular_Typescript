import { Component, OnInit, Output, EventEmitter,Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MdAutocomplete } from '@angular/material';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {

  @ViewChild('mainInput') textbox: ElementRef;

  @Input()
  itemList: any[];

  @Input()
  getName = x => x[0];

  @Input()
  getValue = x => x[1];

  currentValue: any;

  @Input()
  get value() {
    return this.currentValue;
  }

  @Output()
  public valueChange = new EventEmitter<any>();

  set value(obj: any){
    const valueIndex = this.itemList.findIndex(x => this.getValue(x) === obj);
    if(valueIndex >=0){
      this.currentValue = obj;
      this.searchString = this.getName(this.itemList[valueIndex]);
      this.valueChange.emit(obj);
    }
  }

  @Input()
  name: string;

  @Output()
  nameChange = new EventEmitter<string>();

  @Input()
  formControlObj = new FormControl('', Validators.required);

  @Input()
  placeholder: string;

  get searchString(){
    return this.name;
  }

  set searchString(str: string){
    this.name = str;
    this.nameChange.emit(str);
  }

  constructor() { }

  ngOnInit() {
  }

  onTextboxBlur(){
    const currSelected = this.itemList.findIndex(x => this.getName(x) === this.searchString);

    if(currSelected < 0){
      this.value = undefined;
    } else{
      this.value = this.getValue(this.itemList[currSelected]);
    }
  }

  onClearText(){
    this.searchString = '';
    this.textbox.nativeElement.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  }

}
