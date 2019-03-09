import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { ContractComponent } from './contract/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { AuthGuard } from './_guards/index';
import { ControlesComponent } from './Controls/index';
import { PreventUnsavedChangesGuard } from './prevent-save-change';
import { PeriodComponent } from './period/period.component';
import { CommissionsComponent } from './commissions/commissions.component';
import { MaintenanceShellComponent } from './maintenance-shell/maintenance-shell.component';
import { ExpenseComponent } from './expense/expense.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { CashComponent } from './cash/cash.component';
import { JournalEntryShellComponent } from './journalentry-shell/journalentry-shell.component';
import { MaintenanceentryComponent } from './maintenanceentry/maintenanceentry.component';
import { RecurringentryComponent } from './recurringentry/recurringentry.component';
import { JournalExpenseComponent } from './entries/journal-expense/journal-expense.component';
import { AdjustmentComponent } from './entries/adjustment/adjustment.component';
import { MassentryComponent } from './entries/massentry/massentry.component';
import { ExpensemassentryComponent } from './entries/expensemassentry/expensemassentry.component';
import { ComplianceComponent } from './entries/compliance/compliance.component';
import { ReconcileComponent } from './reconcile/reconcile.component';
import { ReportComponent } from './report/report.component';
import { ReportShellComponent } from './report-shell/report-shell.component';
import { Report1Component } from './report/report1/report1.component';
import { Report2Component } from './report/report2/report2.component';
import { Report3Component } from './report/report3/report3.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard],  canDeactivate: [ PreventUnsavedChangesGuard ] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'md', component: ControlesComponent },
    { path: 'contract/:id', component: ContractComponent  },
    { path: 'contract', component: ContractComponent },
    { path: 'invoice', component: InvoiceComponent  },
    { path: 'cash', component: CashComponent  },
    { path: 'reconcile', component: ReconcileComponent },
    //{ path: 'report', component: ReportComponent },
    { path: 'report', component: ReportShellComponent, children: [
        { path: 'report1', component: Report1Component },
        { path: 'report2', component: Report2Component},
        { path: 'report3', component: Report3Component }
    ]},
    { path: 'journal', component: JournalEntryShellComponent, children: [
        { path: 'maintenance', component: MaintenanceentryComponent },
        { path: 'recurring', component: RecurringentryComponent},
        { path: 'expense', component: JournalExpenseComponent },
        { path: 'adjustment', component: AdjustmentComponent },
        { path: 'mass', component: MassentryComponent },
        { path: 'compliance', component: ComplianceComponent}
    ]},
    { path: 'expensemassentry', component: ExpensemassentryComponent  },
    { path: 'maintenance', component: MaintenanceShellComponent, children: [
        { path: 'period', component: PeriodComponent },
        { path: 'expense', component: ExpenseComponent },
        { path: 'commissions', component: CommissionsComponent }
    ]},
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes,{useHash:true});