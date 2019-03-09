import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginUser } from '../_models/index';
import { HttpService } from './http.service';

@Injectable()
export class AuthenticationService {
    constructor(
        private httpService: HttpService,
        private router: Router) { }

    login(username: string, password: string) {
        const body = {UserId: '0', UserName:username, Password:password};
     return  this.httpService.postRequest('api/Account/LoginUser', body)
        .map((response: Response)=>{
            // login successful if there's a jwt token in the response
            let user = response.json();

            if (user) {
                user.password=password;
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                // Instead store in service.
            }
        });
    }

    getCurrentCompanyLogo() {
        const user = JSON.parse(localStorage.getItem('currentUser'));

        if(user){
            return this.httpService.postRequest('api/Account/GetUserCompanyLogo', user);
        }
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}