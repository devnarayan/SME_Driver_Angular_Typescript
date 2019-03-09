import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { User } from '../_models/index';
import { BillingService } from '../_services/index';

@Component({
  selector: 'app-glaccount-list',
  templateUrl: './glaccount-list.component.html',
  styleUrls: ['./glaccount-list.component.css']
})
export class GlaccountListComponent implements OnInit {

  GlaccountList: string[] = [];

  SelectedAccount: string;

  currentUser: User;

  constructor( public dialogRef: MdDialogRef<GlaccountListComponent>, 
    @Inject(MD_DIALOG_DATA) public data: any, 
    private billingService: BillingService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

      this.billingService.getGLAccounts(this.currentUser).subscribe(result => {
        if(result){
          const obj = result.json();
          if(data === 'sme'){
            this.GlaccountList = obj.companyAccounts;
          }
          else if(data === 'driver'){
            this.GlaccountList = obj.driverAccounts;
          }
        }
      })
  }

  ngOnInit() {

  }

  OnClick(item){
    this.SelectedAccount = item;
  }
  confirmModal(){
    this.dialogRef.close(this.SelectedAccount);
  }

  closeModal(){
    this.dialogRef.close();
  }
}
