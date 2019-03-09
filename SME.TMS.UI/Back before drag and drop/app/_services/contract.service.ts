import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../_models/index';
import { CurrentContract } from '../_models/contract';
import { HttpService } from './http.service';

@Injectable()
export class ContractService {
    constructor(private httpService: HttpService) { }

    getContractInfo(contractId: string, user: User) {
        const body = { CurrentUser: { UserId: user.userId, UserName: user.userName, Password: user.password }, ContractId: contractId };
        return this.httpService.postRequest('API/Contract/GetContract', body).map((response: Response) => response.json());
    }

    getContractLookup(user: User) {
        const body = { CurrentUser: { UserId: user.userId, UserName: user.userName, Password: user.password } };
        return this.httpService.postRequest('API/Contract/GetContractLookups', body).map((response: Response) => response.json());
    }
    getContractList(driverId: string, user: User) {
        const body = { CurrentUser: { UserId: user.userId, UserName: user.userName, Password: user.password } };
        return this.httpService.postRequest('API/Contract/GetContractList', body).map((response: Response) => response.json());
    }

    getLoanSchedule(currentUser: User, startDate: Date, frequencyTypeId: number, interestRate: number, loanAmount: number, numberOfPayments: number){
        const body = { startDate, frequencyTypeId, interestRate, loanAmount, numberOfPayments, currentUser };
        return this.httpService.postRequest('api/Contract/GetLoanSchedule', body);
    }

    saveContract(currentContract: CurrentContract, user: User) {
        const body = {
            CurrentUser: { UserId: user.userId, UserName: user.userName, Password: user.password },
            currentContract: currentContract
        };
        console.log(JSON.stringify(body));
        return this.httpService.postRequest('API/Contract/SaveContract', body).map((response: Response) => response.json());
    }
}