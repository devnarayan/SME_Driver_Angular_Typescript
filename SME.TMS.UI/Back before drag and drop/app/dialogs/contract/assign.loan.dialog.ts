
import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DriverService, ContractService, MaintenanceService } from '../../_services/index';
import { FinanceType, CurrentContract } from '../../_models/contract';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { validateConfig } from '@angular/router/src/config';
import { FrequencyType } from '../../_models/frequencyType';
import { FormArray } from '@angular/forms/src/model';
import { User } from '../../_models/user';
import { GetPeriodLookupsResponse } from '../../_responses/GetPeriodLookupsResponse';

@Component({
  selector: 'assign.loan.dialog',
  templateUrl: 'assign.loan.dialog.html',
  styleUrls: ['./assign.loan.dialog.css']
})
export class ContractLoanAssignDialog {
  currentUser: User;

  financeNameFormControl = new FormControl('', [Validators.required]);
  financeTypeFormControl = new FormControl('', [Validators.required]);
  paymentMethodFormControl = new FormControl('');
  typeFormControl = new FormControl('');
  amountFormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);
  loanAmountFormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);
  downPaymentFormControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);
  interestRateFormControl = new FormControl('');
  totalPaymentFormControl = new FormControl('', Validators.required);
  frequencyTypeFormControl = new FormControl('', Validators.required);

  contractStartDateFormControl = new FormControl('', [Validators.required]);
  message: string;
  financeTypeList: FinanceType[] = [];
  financeTypeId: number;

  frequencyTypeList: FrequencyType[] = [];
  frequencyTypeId: number;

  downPayment: number = 0;
  interestOnly: boolean;
  interestRate: number;
  totalPayments: number;

  tableData: any[] = [];

  vin: string = "EIWPEUINFSEKLDFSH"

  paymentMethodList: [string, number][];
  typeList: [string, number][];

  financeTypeValue = x => x.financeTypeId;
  financeTypeName = x => x.financeTypeName;

  frequencyTypeValue = x => x.frequencyTypeId;
  frequencyTypeName = x => x.frequencyName;

  constructor(
    public dialogRef: MdDialogRef<ContractLoanAssignDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private contractService: ContractService,
    private maintenanceService: MaintenanceService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.financeTypeList = data.financeType;
    this.financeTypeId = this.getFinanceTypeId(data.financeTypeName);
    this.maintenanceService.getPeriodLookups(this.currentUser).subscribe(response => {
      const obj = response.json() as GetPeriodLookupsResponse;
      this.frequencyTypeList = obj.frequencyTypes;
    });

    this.paymentMethodList = [];
    this.paymentMethodList[0] = ['Through Settlement', 1];

    this.typeList = [];
    this.typeList[0] = ['SME', 1];
  }

  onOkClick(): void {
    if (this.financeNameFormControl.invalid
      || this.contractStartDateFormControl.invalid
      || this.loanAmountFormControl.invalid) {
      this.message = "Please provide required info.";
    }
    else if(this.data.endDate === undefined
      || this.data.paymentAmount === undefined){
      this.message = "Please hit build button before submitting.";
    }
    else {
      this.data.financeTypeName = this.getFinanceTypeName(this.financeTypeId);
      this.message = "";
      this.dialogRef.close(this.data);
    }
  }
  private getFinanceTypeName(financeTypeId: number): string {
    var ftypeName: string;
    ftypeName = "";
    if (this.financeTypeList != undefined) {
      this.financeTypeList.forEach(element => {
        if (element.financeTypeId == financeTypeId) {
          let updateItem = this.financeTypeList.find(this.findFinanceTypeIndex, element.financeTypeId);
          ftypeName = updateItem.financeTypeName;
        }
      });
    }
    return ftypeName;
  }

  private getFinanceTypeId(financeTypeName: string): number {
    var ftypeId: number;
    ftypeId = 1;
    if (this.financeTypeList != undefined) {
      this.financeTypeList.forEach(element => {
        if (element.financeTypeName == financeTypeName) {
          let updateItem = this.financeTypeList.find(this.findFinanceTypeNameIndex, element.financeTypeName);
          ftypeId = updateItem.financeTypeId;
        }
      });
    }
    return ftypeId;
  }

  findFinanceTypeIndex(newItem) {
    return newItem.financeTypeId === this;
  }
  findFinanceTypeNameIndex(newItem) {
    return newItem.financeTypeName === this;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  build() {
    this.message = '';
    
    if(this.frequencyTypeFormControl.invalid){
      this.message = "Please select a frequency type.";
      return;
    }

    if(this.contractStartDateFormControl.invalid){
      this.message = "Please supply a start date.";
      return;
    }

    if(this.interestRateFormControl.invalid){
      this.message = "Please supply an interest rate.";
      return;
    }

    if(this.loanAmountFormControl.invalid){
      this.message = "Please supply a expense amount.";
      return;
    }

    if(this.totalPaymentFormControl.invalid){
      this.message = "Please supply the amount of payments.";
      return;
    }

    this.contractService.getLoanSchedule(this.currentUser, this.data.startDate, 
          this.frequencyTypeId, this.interestRate,
          this.data.loanAmount, this.totalPayments).subscribe(response => {
            const result = response.json();
            this.tableData = result.loanScheduleItems;
            this.data.endDate = this.tableData[this.tableData.length - 1].paymentDate;
            this.data.paymentAmount = this.tableData[0].paymentAmount;
          });
  }

}

