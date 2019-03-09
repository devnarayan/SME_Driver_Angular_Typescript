import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';

import { User, Invoice, CashReceipt } from '../_models/index';
import { CurrentContract } from '../_models/contract';
import { HttpService } from './http.service';

@Injectable()
export class BillingService {
    constructor(private httpService: HttpService) { }

    getInvoiceLookup(user: User) {
        const body = { CurrentUser: { UserId: user.userId, UserName: user.userName, Password: user.password }};
        return this.basePost(body,"API/Invoice/GetInvoiceLookups");
    }

    getCashReceiptList(verndorId:string, user: User) {
        const body = { CurrentUser: { UserId: user.userId, UserName: user.userName, Password: user.password }, VendorId:verndorId};
        return this.basePost(body,"API/CashReceipt/GetCashReceiptList");
    }

    getInvoiceList(verndorId:string, user: User) {
        const body = { CurrentUser: { UserId: user.userId, UserName: user.userName, Password: user.password }, VendorId:verndorId};
        return this.basePost(body,"API/Invoice/GetInvoiceList");
    }

    saveInvoiceReceiptList(invoiceList: Invoice[], user: User) {
        const body = {
            CurrentUser: { UserId: user.userId, UserName: user.userName, Password: user.password },
            invoices: invoiceList
        };
        return this.basePost(body,"API/Invoice/SaveInvoiceList");
    }

    saveCashReceiptList(cashList: CashReceipt[], user: User) {
        const body = {
            CurrentUser: { UserId: user.userId, UserName: user.userName, Password: user.password },
            cashReceipts: cashList
        };
        return this.basePost(body,"API/CashReceipt/SaveCashReceiptList");
    }

    getGLAccounts(currentUser: User){
        return this.httpService.postRequest('api/Account/GetGLAccountsList', currentUser);
    }

    getCommissionsList(currentUser: User, driverId: number){
        const body = {
            driverId: driverId,
            currentUser: currentUser
        };
        return this.basePost(body, 'api/Invoice/GetCommissionsList');
    }

    private basePost(body:any, url:any){
        return this.httpService.postRequest(url, body).map((response: Response) => response.json());
    }
}