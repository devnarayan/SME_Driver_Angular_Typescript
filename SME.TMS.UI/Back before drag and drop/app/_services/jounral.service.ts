import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { JournalModel, User, CurrentJournalEntry } from '../_models/index';
import { HttpService } from './http.service';


@Injectable()
export class JournalService {
    constructor(private httpService: HttpService) { }

    getJournalLookups(currentUser: User) {
        return this.httpService.postRequest('api/Journal/GetJournalLookups', { currentUser: currentUser });
    }


    getJournalList(currentUser: User, journalTypeId: number, driverId: number, contractId: number) {
        return this.httpService.postRequest('api/Journal/GetJournalList', {
            currentUser: currentUser,
            driverId: driverId,
            contractId: contractId,
            JournalTypeId: journalTypeId
        });
    }

    getJournalEntries(currentUser: User, journalTypeId: number, driverId: number, contractId: number, journalEntryId: number) {
        const body = {
            JournalEntryId: journalEntryId, ContractId: contractId, JournalTypeId: journalTypeId, DriverId: driverId,
            CurrentUser: { UserId: currentUser.userId, UserName: currentUser.userName, Password: currentUser.password }
        };
        return this.httpService.postRequest('API/Journal/GetJournalList', body).map((response: Response) => response.json());
    }

    getJournalImportList(currentUser: User, journalEntryId: number) {
        const body = { JournalEntryId: journalEntryId, JournalImportId: "", CurrentUser: { UserId: currentUser.userId, UserName: currentUser.userName, Password: currentUser.password } };
        return this.httpService.postRequest('API/Journal/GetJournalImportList', body).map((response: Response) => response.json());
    }

    deleteJournalImport(currentUser: User, journalImportId: string) {
        const body = { journalImportId: journalImportId, CurrentUser: { UserId: currentUser.userId, UserName: currentUser.userName, Password: currentUser.password } };
        return this.httpService.postRequest('API/Journal/DeleteJournalImport', body).map((response: Response) => response.json());
    }

    downloadJournalImport(currentUser: User, journalImportId: string) {
        const body = { journalImportId: journalImportId, CurrentUser: { UserId: currentUser.userId, UserName: currentUser.userName, Password: currentUser.password } };
        return this.httpService.postRequest('API/Journal/DownloadJournalImport', body).map((response: Response) => response.json());
    }

    // Mass Entry
    getTemplateDefinition(currentUser: User, vendorId: number) {
        const body = { vendorId: vendorId, CurrentUser: { UserId: currentUser.userId, UserName: currentUser.userName, Password: currentUser.password } };
        return this.httpService.postRequest('API/Journal/GetTemplateDefinition', body).map((response: Response) => response.json());
    }

    getTruckDriverList(currentUser: User) {
        const body = {CurrentUser: { UserId: currentUser.userId, UserName: currentUser.userName, Password: currentUser.password } };
        return this.httpService.postRequest('API/Journal/GetTruckDriverList', body).map((response: Response) => response.json());
    }

}