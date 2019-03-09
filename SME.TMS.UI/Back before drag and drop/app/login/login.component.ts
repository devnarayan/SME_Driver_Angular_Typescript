import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    message:string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.loading = true;

        //localStorage.setItem('currentUser', JSON.stringify(this.model.username));
       // this.router.navigate(['/home'], { queryParams: { returnUrl: "" }});
       
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                data => {
                    this.loading=false;
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.message="Invalid username or password.";
                    this.loading = false;
                });
    }
}
