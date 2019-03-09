
import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DriverService } from '../../_services/index';
import { User, DriverList, DriverModel } from '../../_models/index';

@Component({
  selector: 'assign.driver.dialog',
  templateUrl: 'assign.driver.dialog.html',
})
export class ContractDriverAssignDialog {

  driverNameFormControl = new FormControl('', [Validators.required]);
  startDateFormControl = new FormControl('', [Validators.required]);
  message: string;
  currentUser: User;
  drivers: DriverList[] = [];
  driverModel: DriverModel;
  searchString: string;
  getNameFunc = (x) => x.driverFullName;
  getValueFunc = (x) => x.driverId;

  constructor(
    public dialogRef: MdDialogRef<ContractDriverAssignDialog>,
    private driverService: DriverService,
    @Inject(MD_DIALOG_DATA) public data: any) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.driverService.getDriverList(this.currentUser).subscribe(driverdata => {
      this.driverModel = driverdata;
      this.drivers = this.driverModel.driverList;
    });
    this.drivers = [];
    this.searchString = '';
  }

  onOkClick(): void {
    if (this.driverNameFormControl.invalid || this.startDateFormControl.invalid) {
      this.message = "Please provide required info.";
    } else {
      if (this.data.driverId <= 0) {
        this.message = "Please supply a valid driver.";
      } else {
        this.message = "";
        this.dialogRef.close(this.data);
      }
    }
  }

  private getDriverName(driverId: number): string {
    var driverName: string;
    driverName = "";
    this.drivers.forEach(element => {
      if (element.driverId == driverId) {
        let updateItem = this.drivers.find(this.findDriverIndex, element.driverId);
        driverName = updateItem.driverFullName;
      }
    });
    return driverName;
  }

  findDriverIndex(newItem) {
    return newItem.driverId === this;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}

