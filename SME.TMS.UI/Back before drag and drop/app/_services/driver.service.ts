import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';

import { DriverModel, User, CurrentDriver } from '../_models/index';
import { HttpService } from './http.service';

@Injectable()
export class DriverService {
    constructor(private httpService: HttpService) { }

    getDrivers(driverId: string, user: User) {
        //const body = {DriverId:"1",CurrentUser:{UserId:"2",UserName:"btrozzo@virtualsails.com",Password:"123456"}};
        const body = { DriverId: driverId, CurrentUser: { UserId: user.userId, UserName: user.userName, Password: user.password } };
        return this.httpService.postRequest('API/Driver/GetDriver', body).map((response: Response) => response.json());
    }

    getDriverList(user: User) {
        const body = { CurrentUser: { UserId: user.userId, UserName: user.userName, Password: user.password } };
        return this.httpService.postRequest('API/Driver/GetDriverList', body).map((response: Response) => response.json());
    }
    saveDriver(currentDriver: CurrentDriver, user: User) {
        const body = {
            CurrentUser: { UserId: user.userId, UserName: user.userName, Password: user.password },
            currentDriver: currentDriver
        };
        return this.httpService.postRequest('API/Driver/SaveDriver', body)
        .map((response: Response) => response.json());
    }

    getDriverLookup(user: User) {
        const body = { CurrentUser: { UserId: user.userId, UserName: user.userName, Password: user.password } };
        return this.httpService.postRequest('API/Driver/GetDriverLookups', body).map((response: Response) => response.json());
    }
}