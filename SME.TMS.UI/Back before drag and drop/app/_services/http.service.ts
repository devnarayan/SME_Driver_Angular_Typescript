import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../_models/index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class HttpService{
    private baseUrl: Observable<string>;

    constructor(private http: Http)
    {
        this.baseUrl = http.get('assets/config.json').map(x => x.json().baseUrl);
    }

    postRequest(url: string, content: any){
        return this.baseUrl
            .mergeMap(baseUrl => this.http.post(this.combinePath(baseUrl, url), JSON.stringify(content), this.jwt()));
    }

    getRequest(url: string){
        return this.baseUrl
            .mergeMap(baseUrl => this.http.get(this.combinePath(baseUrl, url), this.jwt()));
    }

    private combinePath(base: string, endpoint: string): string {
        return base.concat(endpoint);
    }

    private jwt(){
        // create authorization header with jwt token
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return new RequestOptions({ headers: headers });
    }
}