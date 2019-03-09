import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Headers, RequestOptions, Response } from '@angular/http';
import { User } from '../_models/user';

@Injectable()
export class UploadService {
    constructor(private httpService: HttpService) { }

    saveRecurringDoc(currentUser: User, formModel: any) {
        const body = {
            journalEntry: formModel,
            currentUser: currentUser
        };
        return this.basePost(body,"api/Journal/SaveJournalImport");
    }

    importCSVDoc(currentUser: User, formModel: any) {
        const body = {
            journalEntry: formModel,
            currentUser: currentUser
        };
        return this.basePost(body,"api/Journal/ImportTempDefinition");
    }

    saveImportDoc(currentUser: User, dataList: any) {
        const body = {
            expenseModal: dataList,
            currentUser: currentUser
        };
        return this.basePost(body,"api/Journal/SaveExpenseMassData");
    }

    downloadTemplate(templateDefinitionId: number) {
        return this.httpService.getRequest('api/Journal/GetTemplateCSV.csv?id=' + templateDefinitionId);
    }
    private basePost(body:any, url:any){
        return this.httpService.postRequest(url, body).map((response: Response) => response.json());
    }
}
