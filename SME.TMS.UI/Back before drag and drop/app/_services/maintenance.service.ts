import { Injectable } from '@angular/core';
import { Period } from '../_models/index';
import { HttpService } from './http.service';
import { User } from '../_models/user';
import { GetPeriodLookupsResponse } from '../_responses/GetPeriodLookupsResponse';
import { ExpenseType } from '../_models/maintenance';
import { Commissions } from '../_models/commissions';

@Injectable()
export class MaintenanceService {
    constructor(private http: HttpService){}

    getPeriodLookups(currentUser: User) {
        return this.http.postRequest('api/Maintenance/GetPeriodLookups', { currentUser: currentUser });
    }

    savePeriodList(currentUser: User, periods: Period[]) {
        return this.http.postRequest('api/Maintenance/SavePeriodList', {
            periods: periods,
            currentUser: currentUser
        });
    }

    getPeriodList(currentUser: User){
        return this.http.postRequest('api/Maintenance/GetPeriodList', { currentUser: currentUser });
    }

    buildPeriodList(currentUser: User, frequencyTypeId: number, startDate: Date, endDate: Date){
        return this.http.postRequest('api/Maintenance/SavePeriodList', {
            currentUser: currentUser,
            startDate: startDate,
            endDate: endDate,
            frequencyTypeId: frequencyTypeId,
            isBuild: true
        });
    }

    getExpenseTypeList(currentUser: User){
        return this.http.postRequest('api/Maintenance/GetExpenseTypeList', {
            currentUser: currentUser
        });
    }

    saveExpenseTypeList(currentUser: User, expenseList: ExpenseType[]){
        return this.http.postRequest('api/Maintenance/SaveExpenseTypeList', {
            currentUser: currentUser,
            ExpenseTypes: expenseList
        });
    }

    getCommissionsList(currentUser: User){
        return this.http.postRequest('api/Maintenance/GetCommissionsList', {
            currentUser: currentUser
        });
    }

    saveCommissionsList(currentUser: User, commissionsList: Commissions[]){
        return this.http.postRequest('api/Maintenance/SaveCommissionsList', {
            currentUser: currentUser,
            Commissions: commissionsList
        });
    }
}
