import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import {FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    User,
    DriverInfoModel,
    DriverInfoResult,
    DriverModel,
    DriverList,
    CurrentDriver,
    DriverEmail,
    DriverMedicalEvaluation,
    DriverInsurance,
    DriverContract,
    DriverPhone,
    PhoneNumberType,
    MedicalProvider,
    DriverEthnicity,
    DriverStateProvince,
    StateProvince,
    GenderType,
    LookupRootObject,
    EthnicityType
} from '../_models/index';
import { UserService, DriverService } from '../_services/index';
import { TestDialog } from '../dialogs/test.dialog';
import { DriverEmailDialog } from '../dialogs/driver.email.dialog';
import { DriverPhoneDialog } from '../dialogs/driver.phone.dialog';
import { MedicalEvaluationHistoryDialog } from '../dialogs/driver/medical.history.dialog';
import { ConfirmDialog } from '../dialogs/confirm.dialog';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { routing } from '../app.routing';
import { NavigationExtras} from "@angular/router";

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {
    driverInfoModel: DriverInfoModel;
    currentDriver: CurrentDriver = {};
    currentUser: User;
    drivers: DriverList[] = [];
    filteredItems: DriverList[] = [];
    driverEmails: DriverEmail[] = [];
    driverMedicalEvalutions: DriverMedicalEvaluation[] = [];
    driverInsurances: DriverInsurance[] = [];
    driverContracts: DriverContract[] = [];
    driverPhones: DriverPhone[] = [];
    driverModel: DriverModel;

    driverLookupModel: LookupRootObject;
    driverPhoneTypes: PhoneNumberType[] = [];
    driverMedicalProviders: MedicalProvider[] = [];
    driverEthnicityTypes: EthnicityType[] = [];
    driverStateProvinces: StateProvince[] = [];
    driverGenderTypes: GenderType[] = [];
    //StateProvinces: StateProvince[] = [];

    gender: string;
    saveMessage: string;
    messageType:string;
    gendertype = [
        'Male',
        'Female',
    ];
    tabTitle: string;

    driverFullName: string;

    form: FormGroup;

    logoData = '';

    firstNameFormControl = new FormControl('', [Validators.required]);
    lastNameFormControl = new FormControl('', [Validators.required]);
    addressFormControl = new FormControl('', [Validators.required]);
    cityFormControl = new FormControl('', [Validators.required]);
    stateFormControl = new FormControl('', [Validators.required]);
    zipFormControl = new FormControl('', [Validators.required]);
    ethnicityFormControl = new FormControl('', [Validators.required]);
    genderFormControl = new FormControl('', [Validators.required]);
    activeFormControl = new FormControl('', [Validators.required]);
    dobFormControl = new FormControl('', [Validators.required]);
    hiredateFormControl = new FormControl('', [Validators.required]);
    licensenoFormControl = new FormControl('', [Validators.required]);
    licenseExpiryFormControl = new FormControl('', [Validators.required]);

    @ViewChild('sidebar') sidebar: SidebarComponent;

    ethnicityValue = x => x.ethnicityTypeId;
    ethnicityName = x => x.ethnicityTypeName;

    private validateRequired(): boolean {
        if (!this.firstNameFormControl.invalid.valueOf()
            && !this.lastNameFormControl.invalid.valueOf()
            && !this.addressFormControl.invalid.valueOf()
            && !this.cityFormControl.invalid.valueOf()
            //&& !this.stateFormControl.invalid.valueOf()
            && !this.zipFormControl.invalid.valueOf()
            // && !this.ethnicityFormControl.invalid.valueOf()
            // && !this.genderFormControl.dirty.valueOf()
            //&& !this.activeFormControl.dirty.valueOf()
            && !this.dobFormControl.invalid.valueOf()
            && !this.hiredateFormControl.invalid.valueOf()
            && !this.licensenoFormControl.invalid.valueOf()
            && !this.licenseExpiryFormControl.invalid.valueOf()
        ) {
            return true;
        }
        else
            return false;
    }
    private validateUnSaved(): boolean {
        if (!this.firstNameFormControl.dirty
            && !this.lastNameFormControl.dirty
            && !this.addressFormControl.dirty
            && !this.cityFormControl.dirty
            && !this.stateFormControl.dirty
            && !this.zipFormControl.dirty
            && !this.ethnicityFormControl.dirty
            // && !this.genderFormControl.dirty.valueOf()
            //&& !this.activeFormControl.dirty.valueOf()
            && !this.dobFormControl.dirty
            && !this.hiredateFormControl.dirty
            && !this.licensenoFormControl.dirty
            && !this.licenseExpiryFormControl.dirty
        ) {
            return true;
        }
        else
            return false;
    }
    constructor( fb: FormBuilder, private userService: UserService, private driverService: DriverService, public dialog: MdDialog) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.form = fb.group({
            firstNameFormControl: this.firstNameFormControl,
            lastNameFormControl : this.lastNameFormControl,
            addressFormControl : this.addressFormControl,
            cityFormControl :  this.cityFormControl,
            stateFormControl : this.stateFormControl,
            zipFormControl : this.zipFormControl,
            ethnicityFormControl :this.ethnicityFormControl,
            genderFormControl :this.genderFormControl,
            activeFormControl : this.activeFormControl,
            dobFormControl :this.dobFormControl,
            hiredateFormControl : this.hiredateFormControl,
            licensenoFormControl : this.licensenoFormControl,
            licenseExpiryFormControl : this.licenseExpiryFormControl,
        });
        
    }

    ngOnInit() {
        this.tabTitle="Dispatch";
        this.loadDriverList(0);
        this.loadDriverLookup();
    }

    selectTab(tabName: string): void {
        this.tabTitle = tabName;
    }

    openAddEmailDialog(): void {
        let emailDialogRef = this.dialog.open(DriverEmailDialog, {
            width: '400px',
            height: '230px',
            data: { title: 'Add new email address.', email: "", isPrimary: false }
        });

        emailDialogRef.afterClosed().subscribe(result => {
            console.log('Driver email added.');
            if (result != undefined) {
                let email = new DriverEmail;
                email.driverEmailAddress = result.email;
                email.isPrimary = result.isPrimary;
                email.driverID = this.currentDriver.driverId;
                email.driverEmailAddressID = 0;
                this.driverEmails.push(email);
                this.updateEmailPrimaryType(email.driverEmailAddressID, email.isPrimary);
            }
        });
    }

    editEmailDialog(emailId: number, email: string, isPrimary: boolean): void {
        let emailDialogRef = this.dialog.open(DriverEmailDialog, {
            width: '400px',
            height: '230px',
            data: { title: 'Update email address.', email: email, isPrimary: isPrimary }
        });

        emailDialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result != undefined) {
                let email = new DriverEmail;
                email.driverEmailAddress = result.email;
                email.isPrimary = result.isPrimary;
                email.driverID = this.currentDriver.driverId;
                email.driverEmailAddressID = emailId;

                let updateItem = this.driverEmails.find(this.findIndexToUpdate, email.driverEmailAddressID);

                let index = this.driverEmails.indexOf(updateItem);

                this.driverEmails[index] = email;
                this.updateEmailPrimaryType(email.driverEmailAddressID, email.isPrimary);
            }
        });
    }

    deleteEmailDialog(emailId: number, email: string, isPrimary: boolean): void {
        let emailDialogRef = this.dialog.open(ConfirmDialog, {
            width: '400px',
            data: { title: 'Are you confirm to delete email?', email: email, isPrimary: isPrimary }
        });

        emailDialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result != undefined) {
                let email = new DriverEmail;
                email.driverEmailAddress = result.email;
                email.isPrimary = result.isPrimary;
                email.driverID = this.currentDriver.driverId;
                email.driverEmailAddressID = emailId;

                let updateItem = this.driverEmails.find(this.findIndexToUpdate, email.driverEmailAddressID);

                let index = this.driverEmails.indexOf(updateItem);

                this.driverEmails.splice(index, 1);

                if (email.isPrimary) {
                    if (this.driverEmails.length > 0) {
                        this.updateEmailPrimaryType(this.driverEmails[0].driverEmailAddressID, true);
                    }
                }
            }
        });
    }

    addPhoneDialog(): void {
        let phoneDialogRef = this.dialog.open(DriverPhoneDialog, {
            width: '400px',
            height: '300px',
            data: { title: 'Add new phone number.'
            , driverPhoneID: 0
            , phone: ""
            , phoneType: ""
            , phoneTypeId: 0
            , isPrimary: false
            , driverPhoneTypes: this.driverPhoneTypes }
        });

        phoneDialogRef.afterClosed().subscribe(result => {
            console.log('Driver phone added.');
            if (result != undefined) {
                let phone = new DriverPhone;
                phone.driverPhoneNumber = result.phone;
                phone.driverPhoneTypeID = result.phoneTypeId;
                phone.isPrimary = result.isPrimary;
                phone.driverPhoneType = this.getPhoneType(result.phoneTypeId);
                phone.driverID = this.currentDriver.driverId;
                phone.driverPhoneID = 0;
                this.driverPhones.push(phone);
                this.updatePhonePrimaryType(phone.driverPhoneID, phone.isPrimary);
            }
        });
    }

    editPhoneDialog(driverPhoneID: number, driverPhoneNumber: string, driverPhoneType: string, driverPhoneTypeID: number, isPrimary: boolean): void {
        let phoneDialogRef = this.dialog.open(DriverPhoneDialog, {
            width: '400px',
            height: '300px',
            data: { title: 'Update phone number.', driverPhoneID: driverPhoneID, phone: driverPhoneNumber, phoneType: driverPhoneType, phoneTypeId: driverPhoneTypeID, isPrimary: isPrimary, driverPhoneTypes: this.driverPhoneTypes }
        });

        phoneDialogRef.afterClosed().subscribe(result => {
            console.log('Driver phone updated.');
            if (result != undefined) {
                let phone = new DriverPhone;
                phone.driverPhoneNumber = result.phone;
                phone.driverPhoneTypeID = result.phoneTypeId;
                phone.driverPhoneType = this.getPhoneType(result.phoneTypeId);
                phone.isPrimary = result.isPrimary;
                phone.driverID = this.currentDriver.driverId;
                phone.driverPhoneID = result.driverPhoneID;

                let updateItem = this.driverPhones.find(this.findPhoneIndexToUpdate, phone.driverPhoneID);

                let index = this.driverPhones.indexOf(updateItem);

                this.driverPhones[index] = phone;
                this.updatePhonePrimaryType(phone.driverPhoneID, phone.isPrimary);
            }
        });
    }

    deletePhoneDialog(driverPhoneID: number, driverPhoneNumber: string, driverPhoneType: string, driverPhoneTypeID: number, isPrimary: boolean): void {
        let phoneDialogRef = this.dialog.open(ConfirmDialog, {
            width: '400px',
            data: { title: 'Are you confirm to delete phone number?', driverPhoneID: driverPhoneID, phone: driverPhoneNumber, phoneType: driverPhoneType, phoneTypeId: driverPhoneTypeID, isPrimary: isPrimary }
        });

        phoneDialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            let phone = new DriverPhone;
            phone.driverPhoneNumber = result.phone;
            phone.driverPhoneTypeID = result.phoneTypeId;
            phone.driverPhoneType = result.driverPhoneType;
            phone.isPrimary = result.isPrimary;
            phone.driverID = this.currentDriver.driverId;
            phone.driverPhoneID = result.driverPhoneID;

            let updateItem = this.driverPhones.find(this.findPhoneIndexToUpdate, phone.driverPhoneID);

            let index = this.driverPhones.indexOf(updateItem);

            this.driverPhones.splice(index, 1);

            if (phone.isPrimary) {
                if (this.driverPhones.length > 0) {
                    this.updatePhonePrimaryType(this.driverPhones[0].driverPhoneID, true);
                }
            }
        });
    }

    openAddMedicalHistoryDialog(): void {
        let medEval = new DriverMedicalEvaluation;
        medEval.driverMedicalEvaluationID = 0;
        let medEvalDialogRef = this.dialog.open(MedicalEvaluationHistoryDialog, {
            width: '400px',
            height: '430px',
            data: { title: 'Add new medical history.', 
                    driverMedicalProviders: this.driverMedicalProviders,
                    driverMedicalProviderID: 0,
                    driverMedicalProviderName: '',
                    driverMedicalProviderRate: medEval.driverMedicalProviderRate,
                    driverMedicalEffectiveDate: medEval.driverMedicalEffectiveDate,
                    driverMedicalExpirationDate: medEval.driverMedicalExpirationDate}
        });

        medEvalDialogRef.afterClosed().subscribe(result => {
            console.log('Driver medical history added.');
            if (result != undefined) {
                let medical = new DriverMedicalEvaluation;
                medical.driverMedicalProviderID = result.driverMedicalProviderID;
                medical.driverMedicalProviderName = this.getMedicalProviderName(result.driverMedicalProviderID);
                medical.driverMedicalProviderRate = result.driverMedicalProviderRate;
                medical.driverMedicalEffectiveDate = result.driverMedicalEffectiveDate;
                medical.driverMedicalExpirationDate = result.driverMedicalExpirationDate;
                this.driverMedicalEvalutions.push(medical);
           }
        });
    }

    editMedicalHistoryDialog(driverMedicalEvaluationID: number, driverMedicalProviderID: number, driverMedicalEffectiveDate: string, driverMedicalExpirationDate: string, driverMedicalProviderRate: number): void {
        let medEvalDialogRef = this.dialog.open(MedicalEvaluationHistoryDialog, {
            width: '400px',
            height: '430px',
            data: { title: 'Update medical history.', 
                    driverMedicalEvaluationID: driverMedicalEvaluationID,
                    driverMedicalProviderID: driverMedicalProviderID,
                    driverMedicalEffectiveDate: driverMedicalEffectiveDate,
                    driverMedicalExpirationDate: driverMedicalExpirationDate,
                    driverMedicalProviderRate: driverMedicalProviderRate,
                    driverMedicalProviders: this.driverMedicalProviders,
                    }
             });

        medEvalDialogRef.afterClosed().subscribe(result => {
            console.log('Medical information updated.');
            if (result != undefined) {
                let medical = new DriverMedicalEvaluation;
                medical.driverMedicalEvaluationID = result.driverMedicalEvaluationID;
                medical.driverMedicalProviderID = result.driverMedicalProviderID;
                medical.driverMedicalProviderName = this.getMedicalProviderName(result.driverMedicalProviderID);
                medical.driverMedicalProviderRate = result.driverMedicalProviderRate;
                medical.driverMedicalEffectiveDate = result.driverMedicalEffectiveDate;
                medical.driverMedicalExpirationDate = result.driverMedicalExpirationDate;

                let updateItem = this.driverMedicalEvalutions.find(this.findMedicalEvalIndexToUpdate, medical.driverMedicalEvaluationID);

                let index = this.driverMedicalEvalutions.indexOf(updateItem);

                this.driverMedicalEvalutions[index] = medical;
            }
        });
    }

    deleteMedicalHistoryDialog(driverMedicalEvaluationID: number): void {
        let medEvalDialogRef = this.dialog.open(ConfirmDialog, {
            width: '400px',
            data: { title: 'Are you confirm to delete medical history?', medicalEval: driverMedicalEvaluationID}
        });
        medEvalDialogRef.afterClosed().subscribe(result => {
            console.log('Medical information updated.');
            if (result != undefined) {
                let medical = new DriverMedicalEvaluation;
                medical.driverMedicalEvaluationID = result.medicalEval;

                let updateItem = this.driverMedicalEvalutions.find(this.findMedicalEvalIndexToUpdate, medical.driverMedicalEvaluationID);

                let index = this.driverMedicalEvalutions.indexOf(updateItem);

                this.driverMedicalEvalutions.splice(index, 1);
            }
        });
    }

    findIndexToUpdate(newItem) {
        return newItem.driverEmailAddressID === this;
    }
    findPhoneIndexToUpdate(newItem) {
        return newItem.driverPhoneID === this;
    }
    findPhoneTypeIndex(newItem) {
        return newItem.phoneNumberTypeId === this;
    }
    findMedicalEvalIndexToUpdate(newItem) {
        return newItem.driverMedicalEvaluationID === this;
    }
    findMedicalProviderIndex(newItem) {
        return newItem.medicalProviderId === this;
    }
    findEthnicityIndex(newItem) {
        return newItem.driverEthnicityID === this;
    }
    findStateProvinceIndex(newItem) {
        return newItem.driverStateProvinceId === this;
    }

    findGenderTypeIndex(newItem) {
        return newItem.genderTypeId === this;
    }

    selectDriver(driverId: number) {
        this.loadDriverInfo(driverId);
    }

    isActive(driverId: number) {
        if (this.currentDriver.driverId == driverId) {
            return true;
        }
        return false;
    }
    selectPreDriver() {
        for (var i = 0; i < this.drivers.length - 1; i++) {
            if (this.drivers[i].driverId == this.currentDriver.driverId) {
                if (i != 0) {
                    this.loadDriverInfo(this.drivers[i - 1].driverId);
                }
            }
        }
    }
    selectNextDriver() {
        for (var i = 0; i < this.drivers.length - 1; i++) {
            if (this.drivers[i].driverId == this.currentDriver.driverId) {
                if (i != this.drivers.length - 1) {
                    this.loadDriverInfo(this.drivers[i + 1].driverId);
                }
            }
        }
    }

    addNewDriver() {
        this.currentDriver = new CurrentDriver();
        this.currentDriver.driverId = -1;
        this.loadDriverInfo.apply;
        this.driverPhones = new Array<DriverPhone>();
        this.driverEmails = new Array<DriverEmail>();
        this.driverContracts = new Array<DriverContract>();
        this.driverInsurances = new Array<DriverInsurance>();
        this.driverMedicalEvalutions = new Array<DriverMedicalEvaluation>();
        this.saveMessage = "";
        this.messageType="info";
      }
    

    saveDriver() {
        if (this.validateRequired()) {
            this.currentDriver.genderID = this.getGenderId();
            this.driverService.saveDriver(this.currentDriver, this.currentUser).subscribe(driverdata => {
                this.saveMessage = "Driver information saved successfully.";
                this.messageType="success";
            });
        }
        else {
            this.saveMessage = "Please provide required data.";
            this.messageType="error";
        }
    }

    print() {
        let printContents, popupWin;
        printContents = document.getElementById('tab4').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Print tab</title>
              <style>
              //........Customized style.......
              </style>
            </head>
        <body onload="window.print();window.close()">${printContents}</body>
          </html>`
        );
        popupWin.document.close();
    }

    assignCopy() {
        this.filteredItems = Object.assign([], this.drivers);
    }
    filterItem() {
        if (!this.driverFullName) this.assignCopy(); //when nothing has typed
        this.filteredItems = Object.assign([], this.drivers).filter(
            item => item.driverFullName.toString().toLowerCase().indexOf(this.driverFullName.toString().toLowerCase()) > -1
        )
        if(this.filteredItems.length==0){
            this.saveMessage="Driver not found!!!";
            this.messageType="info";
        }
        else{
            this.saveMessage="";
            this.messageType="info";
        }
        this.sidebar.ParseList<DriverList>(this.filteredItems, (x) => x.driverFullName, (x) => x.driverId);
    }

    activeactiveChange(isActive: boolean) {
        if (isActive == true) {
            this.currentDriver.isActive = false;
        } else {
            this.currentDriver.isActive = true;
        }
    }
    phonePrimaryChange(phone:DriverPhone){
        this.updatePhonePrimaryType(phone.driverPhoneID, !phone.isPrimary);
    }
    emailPrimaryChange(email:DriverEmail){
        this.updateEmailPrimaryType(email.driverEmailAddressID, !email.isPrimary);
    }

    // Update PhoneType to driver phone list.
    private updateEmailPrimaryType(driverEmailAddressID: number, isPrimary: boolean) {
        var isPrimaryFound: boolean;
        isPrimaryFound = false;
        this.driverEmails.forEach(element => {
            let updateItem = this.driverPhoneTypes.find(this.findIndexToUpdate, element.driverEmailAddressID);
            if (driverEmailAddressID == element.driverEmailAddressID) {
                element.isPrimary = isPrimary;
                isPrimaryFound = isPrimary;
            }
            else
                element.isPrimary = false;
        });
        if (isPrimaryFound == false) {
            if (this.driverEmails.length > 0) {
                this.driverEmails[0].isPrimary = true;
            }
        }
    }
    private updatePhonePrimaryType(driverPhoneID: number, isPrimary: boolean) {
        var isPrimaryFound: boolean;
        isPrimaryFound = false;
        this.driverPhones.forEach(element => {
            let updateItem = this.driverPhoneTypes.find(this.findPhoneTypeIndex, element.driverPhoneTypeID);
            if (driverPhoneID == element.driverPhoneID) {
                element.isPrimary = isPrimary;
                isPrimaryFound = isPrimary;
            }
            else
                element.isPrimary = false;
        });
        if (isPrimaryFound == false) {
            if (this.driverPhones.length > 0) {
                this.driverPhones[0].isPrimary = true;
            }
        }
    }
    private updateStateProvince() {
        this.driverStateProvinces.forEach(element => {
            let updateItem = this.driverStateProvinces.find(this.findStateProvinceIndex, element.stateProvinceId);
            element.stateProvinceName = updateItem.stateProvinceName;
        });
    }
    private getStateProvince(driverStateProvinceId: number): string {
        var driverStateProvince: string;
        driverStateProvince = "UNKNOWN";
        this.driverStateProvinces.forEach(element => {
            if (element.stateProvinceId == driverStateProvinceId) {
                let updateItem = this.driverStateProvinces.find(this.findStateProvinceIndex, element.stateProvinceId);
                driverStateProvince = updateItem.stateProvinceName;
            }
        });
        return driverStateProvince;
    }
    private updateEthnicityType() {
        this.driverEthnicityTypes.forEach(element => {
            let updateItem = this.driverEthnicityTypes.find(this.findEthnicityIndex, element.ethnicityTypeId);
            element.ethnicityTypeName = updateItem.ethnicityTypeName;
        });
    }
    private getEthnicityType(ethnicityTypeId: number): string {
        var ethnicityType: string;
        ethnicityType = "UNKNOWN";
        this.driverEthnicityTypes.forEach(element => {
            if (element.ethnicityTypeId == ethnicityTypeId) {
                let updateItem = this.driverEthnicityTypes.find(this.findEthnicityIndex, element.ethnicityTypeId);
                ethnicityType = updateItem.ethnicityTypeName;
            }
        });
        return ethnicityType;
    }
    private updatePhoneType() {
        this.driverPhones.forEach(element => {
            let updateItem = this.driverPhoneTypes.find(this.findPhoneTypeIndex, element.driverPhoneTypeID);
            element.driverPhoneType = updateItem.phoneNumberTypeName;
        });
    }
    private getPhoneType(phoneTypeId: number): string {
        var phoneType: string;
        phoneType = "UNKNOWN";
        this.driverPhones.forEach(element => {
            if (element.driverPhoneTypeID == phoneTypeId) {
                let updateItem = this.driverPhoneTypes.find(this.findPhoneTypeIndex, element.driverPhoneTypeID);
                phoneType = updateItem.phoneNumberTypeName;
            }
        });
        return phoneType;
    }
    private updateMedicalProviderName() {
        this.driverMedicalProviders.forEach(element => {
            let updateItem = this.driverMedicalProviders.find(this.findMedicalProviderIndex, element.medicalProviderId);
            element.medicalProviderName = updateItem.medicalProviderName;
        });
    }
   private getMedicalProviderName(medicalProviderId: number): string {
        var medicalProviderName: string;
        //medicalProviderName = "Health South";
        this.driverMedicalProviders.forEach(element => {
            if (element.medicalProviderId == medicalProviderId) {
                let updateItem = this.driverMedicalProviders.find(this.findMedicalProviderIndex, element.medicalProviderId);
                medicalProviderName = updateItem.medicalProviderName;
            }
        });
        return medicalProviderName;
    }

    private getGenderName(genderID: number): string {
        var genderType: string;
        genderType = "Male";
        this.driverGenderTypes.forEach(element => {
            if (element.genderTypeId == genderID) {
                let updateItem = this.driverGenderTypes.find(this.findGenderTypeIndex, element.genderTypeId);
                genderType = updateItem.genderTypeName;
            }
        });
        return genderType;
    }
    private getGenderId(): number {
        var genderId: number;
        genderId = 0;
        this.driverGenderTypes.forEach(element => {
            if (element.genderTypeName == this.gender) {
                let updateItem = this.driverGenderTypes.find(this.findGenderTypeIndex, element.genderTypeId);
                genderId = element.genderTypeId;
            }
        });
        return genderId;
    }
    private loadDriverInfo(driverId: number) {
        this.driverService.getDrivers(driverId.toString(), this.currentUser).subscribe(driver => {
            this.driverInfoModel = driver;
            if (this.driverInfoModel.isCompletedSuccessfully) {
                this.currentDriver = this.driverInfoModel.result.currentDriver;
                this.driverPhones = this.currentDriver.driverPhones;
                this.driverEmails = this.currentDriver.driverEmails;
                this.driverContracts = this.currentDriver.driverContracts;
                this.driverInsurances = this.currentDriver.driverInsurances;
                this.driverMedicalEvalutions = this.currentDriver.driverMedicalEvaluations;
                this.gender = this.getGenderName(this.currentDriver.genderID);
                this.updatePhoneType();
                this.updateMedicalProviderName();
                this.saveMessage = "";
                this.messageType="info";
            }
        });
    }
    private loadDriverList(driverId: number) {
        this.driverService.getDriverList(this.currentUser).subscribe(driverdata => {
            this.driverModel = driverdata;
            this.drivers = this.driverModel.driverList;
            this.loadDriverInfo(this.drivers[0].driverId);
            this.sidebar.ParseList<DriverList>(this.drivers, (x) => x.driverFullName, (x) => x.driverId);
            this.assignCopy();
        });
    }

    private loadDriverLookup() {
        this.driverService.getDriverLookup(this.currentUser).subscribe(driverLookupdata => {
            this.driverLookupModel = driverLookupdata;
            this.driverPhoneTypes = this.driverLookupModel.phoneNumberTypes;
            this.driverGenderTypes = this.driverLookupModel.genderTypes;
            this.driverStateProvinces = this.driverLookupModel.stateProvinces;
            this.driverEthnicityTypes = this.driverLookupModel.ethnicityTypes;
            this.driverMedicalProviders = this.driverLookupModel.medicalProviders;
            this.logoData = 'data:image/jpg;base64,' + this.driverLookupModel.logoData;
        });
    }
}