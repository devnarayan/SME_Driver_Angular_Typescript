import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import 'hammerjs';

// used to create fake backend
// import { fakeBackendProvider } from './_helpers/index';
// import { MockBackend, MockConnection } from '@angular/http/testing';
// import { BaseRequestOptions } from '@angular/http';

import { routing } from './app.routing';

import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService, UploadService, DriverService, MaintenanceService, BillingService, ContractService } from './_services/index';
import { HomeComponent } from './home/index';
import { TestDialog } from './dialogs/test.dialog';
import { DriverEmailDialog } from './dialogs/driver.email.dialog';
import { DriverPhoneDialog } from './dialogs/driver.phone.dialog';
import { ConfirmDialog } from './dialogs/confirm.dialog';;;;

import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { ControlesComponent } from './Controls/index';

// Upload Component

import { FormdataUploadComponent } from './_shared/fileupload.component';
import { Base64UploadComponent } from './_shared/base64-upload.component';

// Controls
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutocompleteOverviewExample } from './Controls/AC/autocomplete_example';
import { CheckboxConfigurableExample } from './Controls/CK/checkbox_example';
import { DatepickerOverviewExample } from './Controls/DPicker/datepicker_example';
import { InputFormExample } from './Controls/TXT/input_example';
import { RadioNgModelExample } from './Controls/RBTN/radio_example';
import { SelectFormExample } from './Controls/SEL/select_example';
import { SliderConfigurableExample } from './Controls/SLDR/slider_example';
import { SlideToggleConfigurableExample } from './Controls/SLDT/slide_toggle_example';
import { GridListDynamicExample } from './Controls/GRD/grid_example';

import { ButtonTypesExample } from './Controls/BTN/button_example';
import { ButtonToggleExclusiveExample } from './Controls/BTNT/button_toggle_example';
import { CountrylistComponent } from './Controls/countrylist/countrylist.component';
import { ContractComponent } from './contract/contract.component';
import { PreventUnsavedChangesGuard } from './prevent-save-change';


import {
    MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdNativeDateModule,
    MdAutocompleteModule,
    MdButtonToggleModule,
    MdCheckboxModule,
    MdDatepickerModule,
    MdDialogModule,
    MdExpansionModule,
    MdGridListModule,
    MdInputModule,
    MdListModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdSnackBarModule,
    MdSortModule,
    MdTableModule,
    MdTabsModule,
    MdTooltipModule,
} from '@angular/material';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavComponent } from './nav/nav.component';
import { PeriodComponent } from './period/period.component';
import { CommissionsComponent } from './commissions/commissions.component';
import { MaintenanceShellComponent } from './maintenance-shell/maintenance-shell.component';
import { RouterModule } from '@angular/router';
import { HttpService } from './_services/http.service';
import { ExpenseComponent } from './expense/expense.component';
import { SidebarLocatorService } from './_services/sidebar-locator.service';
import { GlaccountListComponent } from './glaccount-list/glaccount-list.component';
import { CashComponent } from './cash/cash.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { DataTableModule } from 'angular-4-data-table-bootstrap-4';
import { CashBillingDialog } from './dialogs/billing/cash.billing.dialog';
import { InvoiceBillingDialog } from './dialogs/billing/invoice.billing.dialog';
import { ContractLoanAssignDialog } from './dialogs/contract/assign.loan.dialog';
import { ContractDriverAssignDialog } from './dialogs/contract/assign.driver.dialog';
import { ContractTruckAssignDialog } from './dialogs/contract/assign.truck.dialog';
import { MedicalEvaluationHistoryDialog } from './dialogs/driver/medical.history.dialog';
import { InsuranceHistoryDialog } from './dialogs/driver/insurance.history.dialog';
import { ContractHistoryDialog } from './dialogs/driver/contract.history.dialog';
import { AddDocDialog } from './dialogs/maintenance/adddoc.dialog';
import { MassEntryImportDialog } from './dialogs/maintenance/massentryimport';
import { MapTruckDriverDialog} from './dialogs/maintenance/maptruckdriver.dialog';
import { JournalEntryShellComponent } from './journalentry-shell/journalentry-shell.component';
import { MaintenanceentryComponent } from './maintenanceentry/maintenanceentry.component';
import { RecurringentryComponent } from './recurringentry/recurringentry.component';
import { JournalService } from './_services/jounral.service';
import { DateFilter } from './_pipes/dateFilter.pipe';
import { SnackbarService } from './_services/snackbar.service';
import { ReconcileComponent } from './reconcile/reconcile.component';
import { ReportComponent } from './report/report.component';
import { ReportShellComponent } from './report-shell/report-shell.component';
import { Report1Component } from './report/report1/report1.component';
import { Report2Component } from './report/report2/report2.component';
import { Report3Component } from './report/report3/report3.component';
import { JournalExpenseComponent } from './entries/journal-expense/journal-expense.component';
import { AdjustmentComponent } from './entries/adjustment/adjustment.component';
import { MassentryComponent } from './entries/massentry/massentry.component';
import { ComplianceComponent } from './entries/compliance/compliance.component';
import { CdkTableModule } from '@angular/cdk';
import { StringFilter } from './_pipes/stringFilter.pipe';
import { CommissionBillingDialog } from './dialogs/billing/commission.billing.dialog';
import { SummaryBillingDialog } from './dialogs/billing/summary.billing';
import { AdjustmentBillingDialog } from './dialogs/billing/adjustment.billing';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ExpensemassentryComponent } from './entries/expensemassentry/expensemassentry.component';

@NgModule({
    exports: [
        MdAutocompleteModule,
        MdButtonModule,
        MdButtonToggleModule,
        MdCardModule,
        MdCheckboxModule,
        MdDatepickerModule,
        MdDialogModule,
        MdExpansionModule,
        MdGridListModule,
        MdIconModule,
        MdInputModule,
        MdListModule,
        MdMenuModule,
        MdNativeDateModule,
        MdPaginatorModule,
        MdProgressBarModule,
        MdProgressSpinnerModule,
        MdRadioModule,
        MdRippleModule,
        MdSelectModule,
        MdSidenavModule,
        MdSliderModule,
        MdSlideToggleModule,
        MdSnackBarModule,
        MdSortModule,
        MdTableModule,
        MdTabsModule,
        MdToolbarModule,
        MdTooltipModule,
    ],
    declarations: []
})
export class DMSMaterialModule { }

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        CdkTableModule,
        routing,
        MaterialModule,
        BrowserAnimationsModule,
        MdButtonModule,
        MdMenuModule,
        MdCardModule,
        MdToolbarModule,
        MdIconModule,
        DMSMaterialModule,
        MdNativeDateModule,
        ReactiveFormsModule,
        DataTableModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        SidebarComponent,
        NavComponent,
       
        DateFilter,
        StringFilter,

        LoginComponent,
        RegisterComponent,
        FormdataUploadComponent,
        Base64UploadComponent,

        ControlesComponent,
        ExpenseComponent,
        GlaccountListComponent,
        CashComponent,
        InvoiceComponent,
        ReconcileComponent,
        ReportComponent,
        ReportShellComponent,
        Report1Component,
        Report2Component,
        Report3Component,
        JournalExpenseComponent,
        AdjustmentComponent,
        ComplianceComponent,
        MassentryComponent,
        AutocompleteComponent,

        TestDialog,
        DriverEmailDialog,
        DriverPhoneDialog,
        ConfirmDialog,
        AddDocDialog,
        MassEntryImportDialog,
        MapTruckDriverDialog,
        ContractHistoryDialog,
        InsuranceHistoryDialog,
        MedicalEvaluationHistoryDialog,
        ContractTruckAssignDialog,
        ContractDriverAssignDialog,
        ContractLoanAssignDialog,
        InvoiceBillingDialog,
        CashBillingDialog,
        CommissionBillingDialog,
        SummaryBillingDialog,
        AdjustmentBillingDialog,

        AutocompleteOverviewExample,
        CheckboxConfigurableExample,
        DatepickerOverviewExample,
        InputFormExample,
        RadioNgModelExample,
        SelectFormExample,
        SliderConfigurableExample,
        SlideToggleConfigurableExample,
        GridListDynamicExample,
        ButtonTypesExample,
        ButtonToggleExclusiveExample,
        CountrylistComponent,
        ContractComponent,
        PeriodComponent,
        CommissionsComponent,
        MaintenanceShellComponent,
        JournalEntryShellComponent,
        MaintenanceentryComponent,
        RecurringentryComponent,
        ExpensemassentryComponent
    ],
    providers: [
        HttpService,
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        UploadService,
        DriverService,
        PreventUnsavedChangesGuard,
        MaintenanceService,
        SidebarLocatorService,
        BillingService,
        ContractService,
        JournalService,
        SnackbarService
        // providers used to create fake backend
        // fakeBackendProvider,
        // MockBackend,
        // BaseRequestOptions
    ],
    entryComponents: [
        TestDialog,
        DriverEmailDialog,
        DriverPhoneDialog,
        ConfirmDialog,
        AddDocDialog,
        MassEntryImportDialog,
        MapTruckDriverDialog,
        ContractHistoryDialog,
        InsuranceHistoryDialog,
        MedicalEvaluationHistoryDialog,
        ContractTruckAssignDialog,
        ContractDriverAssignDialog,
        ContractLoanAssignDialog,
        InvoiceBillingDialog,
        CashBillingDialog,
        CommissionBillingDialog,
        SummaryBillingDialog,
        AdjustmentBillingDialog,
        GlaccountListComponent
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }