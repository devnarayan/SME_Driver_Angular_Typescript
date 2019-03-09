import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../_models/index';
import { UserService, ContractService } from '../_services/index';
import {
  ContractRootObject, ContractListModel, ContractList, ContractLookupModel, FinanceType, Truck, CurrentContract,
  AssignedDriver, AssignedTruck, AssignedFinanceAgreement, CommonFunction
} from '../_models/contract';

import { ConfirmDialog } from '../dialogs/confirm.dialog';
import { ContractTruckAssignDialog } from '../dialogs/contract/assign.truck.dialog';
import { ContractDriverAssignDialog } from '../dialogs/contract/assign.driver.dialog';
import { ContractLoanAssignDialog } from '../dialogs/contract/assign.loan.dialog';
import { SidebarComponent } from '../sidebar/sidebar.component';
declare var jquery: any;
declare var $: any;

@Component({
  moduleId: module.id,
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {
  currentUser: User;
  currentContract: CurrentContract = {};
  contractInfo: ContractRootObject;
  contractListObj: ContractListModel;
  contracts: ContractList[] = [];
  filteredItems: ContractList[] = [];
  contractLookupModel: ContractLookupModel;
  financeTypeList: FinanceType[] = [];
  truckList: Truck[] = [];

  assignedDrivers: AssignedDriver[] = [];
  assignedTrucks: AssignedTruck[] = [];
  assignedFinanceAgreements: AssignedFinanceAgreement[] = [];

  tabTitle: string;
  contractFullName: string;
  saveMessage: string;
  messageType: string;
  common: CommonFunction;
  form: FormGroup;

  @ViewChild('sidebar') sidebar: SidebarComponent;

  logoData = '';

  constructor(fb: FormBuilder, private userService: UserService, private contractService: ContractService, public dialog: MdDialog) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.form = fb.group({
      contractNumberFormControl: this.contractNumberFormControl,
      contractNameFormControl: this.contractNameFormControl,
      responsiblePartyFormControl: this.responsiblePartyFormControl,
      contractStartDateFormControl: this.contractStartDateFormControl,
      contractEndDateFormControl: this.contractEndDateFormControl,
      initialDepositFormControl: this.initialDepositFormControl,
      payrollIdFormControl: this.payrollIdFormControl,
      tinFormControl: this.tinFormControl,
      percentRetainedFormControl: this.percentRetainedFormControl,
  });

  }

  ngOnInit() {
    this.loadContractList(0);
    this.loadContractLookup();

    $(document).ready(function () {
      var ksBody = $('.body');
      var ksSidebar = $('.ks-sidebar');
      var ksSidebarToggle = $('.ks-sidebar-toggle');
      var ksSidebarMobileToggle = $('.ks-sidebar-mobile-toggle');
      var isSidebarFixed = ksBody.hasClass('ks-sidebar-fixed');
      var isSidebarCompact = ksBody.hasClass('ks-sidebar-compact');
      var ksMobileOverlay = $('.ks-mobile-overlay');
      var ksNavbarMenu = $('.ks-navbar-menu');
      var ksNavbarMenuToggle = $('.ks-navbar-menu-toggle');
      var ksNavbarActions = $('.ks-navbar .ks-navbar-actions');
      var ksNavbarActionsToggle = $('.ks-navbar-actions-toggle');
      var ksSearchOpen = $('.ks-search-open');
      var ksSearchClose = $('.ks-search-close');
      var ksSettingsSlideControl = $('.ks-settings-slide-control');
      var ksSettingsSlideCloseControl = $('.ks-settings-slide-close-control');

      setTimeout(function () {
        $.LoadingOverlay("hide");
        ksBody.removeClass('ks-page-loading');
      }, 1000);

      // Replace default dropdown logic for sidebar
      ksSidebar.find('.dropdown-toggle').on('click', function () {
        if ($(this).closest('.dropdown-menu').size()) {
          if ($(this).closest('.dropdown-menu').find('.dropdown.open > .dropdown-toggle')[0] != $(this)[0]) {
            $(this).closest('.dropdown-menu').find('.dropdown.open').removeClass('open');
          }

          $(this).closest('.dropdown').toggleClass('open');
        } else {
          if ($('.ks-sidebar .dropdown.open > .dropdown-toggle')[0] != $(this)[0]) {
            $('.ks-sidebar .dropdown.open').removeClass('open');
          }

          $(this).closest('.dropdown').toggleClass('open');
        }
      });

      /**
       * Toggle sidebar to compact size
       */
      ksSidebarToggle.on('click', function () {
        if (!isSidebarCompact) {
          if (ksBody.hasClass('ks-sidebar-compact')) {
            ksBody.removeClass('ks-sidebar-compact');
          } else {
            ksBody.addClass('ks-sidebar-compact');
          }
        }
      });

      ksSidebar.on({
        mouseenter: function () {
          if (ksBody.hasClass('ks-sidebar-compact')) {
            ksBody.addClass('ks-sidebar-compact-open');
          }
        },
        mouseleave: function () {
          if (ksBody.hasClass('ks-sidebar-compact')) {
            ksBody.removeClass('ks-sidebar-compact-open');
            ksSidebar.find('.open').removeClass('open');
          }
        }
      });

      // Navbar toggle
      ksNavbarMenuToggle.on('click', function () {
        var self = $(this);

        if (ksMobileOverlay.hasClass('ks-open') && !self.hasClass('ks-open')) {
          ksMobileOverlay.removeClass('ks-open');
          ksSidebar.removeClass('ks-open');
          ksSidebarMobileToggle.removeClass('ks-open');
          ksNavbarActions.removeClass('ks-open');
          ksNavbarActionsToggle.removeClass('ks-open');
        }

        self.toggleClass('ks-open');
        ksNavbarMenu.toggleClass('ks-open');
        ksMobileOverlay.toggleClass('ks-open');
      });

      ksSidebarMobileToggle.on('click', function () {
        var self = $(this);

        if (ksMobileOverlay.hasClass('ks-open') && !self.hasClass('ks-open')) {
          ksMobileOverlay.removeClass('ks-open');
          ksNavbarMenu.removeClass('ks-open');
          ksNavbarMenuToggle.removeClass('ks-open');
          ksNavbarActions.removeClass('ks-open');
          ksNavbarActionsToggle.removeClass('ks-open');
        }

        self.toggleClass('ks-open');
        ksSidebar.toggleClass('ks-open');
        ksMobileOverlay.toggleClass('ks-open');
      });

      ksNavbarActionsToggle.on('click', function () {
        var self = $(this);
        if (ksMobileOverlay.hasClass('ks-open') && !self.hasClass('ks-open')) {
          ksMobileOverlay.removeClass('ks-open');
          ksNavbarMenu.removeClass('ks-open');
          ksNavbarMenuToggle.removeClass('ks-open');
          ksSidebar.removeClass('ks-open');
          ksSidebarMobileToggle.removeClass('ks-open');
        }

        self.toggleClass('ks-open');
        ksNavbarActions.toggleClass('ks-open');
        ksMobileOverlay.toggleClass('ks-open');
      });

      ksMobileOverlay.on('click', function () {
        if (ksSidebar.hasClass('ks-open')) {
          ksSidebar.toggleClass('ks-open');
        } else if (ksNavbarMenu.hasClass('ks-open')) {
          ksNavbarMenu.toggleClass('ks-open');
        } else if (ksNavbarActions.hasClass('ks-open')) {
          ksNavbarActions.toggleClass('ks-open');
        }

        if (ksSidebarMobileToggle.hasClass('ks-open')) {
          ksSidebarMobileToggle.toggleClass('ks-open');
        }

        if (ksNavbarMenuToggle.hasClass('ks-open')) {
          ksNavbarMenuToggle.toggleClass('ks-open');
        }

        if (ksNavbarActionsToggle.hasClass('ks-open')) {
          ksNavbarActionsToggle.toggleClass('ks-open');
        }

        ksMobileOverlay.toggleClass('ks-open');
      });

      ksSearchOpen.on('click', function () {
        $(this).closest('.ks-navbar-menu').toggleClass('ks-open');
        $('.ks-search-form .form-control').focus();
      });

      ksSearchClose.on('click', function () {
        $(this).closest('.ks-navbar-menu').toggleClass('ks-open');
        $('.ks-search-form .form-control').val('').blur();
      });

      ksSettingsSlideControl.on('click', function () {
        $(this).closest('.ks-settings-slide-block').toggleClass('ks-open');
      });

      ksSettingsSlideCloseControl.on('click', function () {
        $(this).closest('.ks-settings-slide-block').removeClass('ks-open');
      });

      /**
       * Prevent default events for messages dropdown
       */
      $('.ks-navbar .ks-messages .nav-tabs .nav-link').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).tab('show');
      });

      /**
       * Prevent default events for notifications dropdown
       */
      $('.ks-navbar .ks-notifications .nav-tabs .nav-link').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).tab('show');
      });

      /**
       * Prevent default events for nested dropdown menus
       */
      $('.ks-navbar .dropdown-menu .dropdown-toggle').on('click', function (e) {
        var self = $(this);
        var parent = self.closest('.dropdown');
        e.stopPropagation();
        e.preventDefault();

        parent.toggleClass('show');
      });

      $(document).on('change', '.btn-file :file', function (e) {
        var input = $(this);
        var label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        $(e.target).closest('.btn').find('.text').text(label);
      });

      $('.ks-document-viewer .ks-view-toggle').on('click', function () {
        var docViewer = $(this).closest('.ks-document-viewer');

        if (!$(this).closest('.ks-document-viewer').hasClass('ks-expanded')) {
          docViewer.addClass('ks-expanded');
          $(this).find('.ks-icon').removeClass('fa-expand').addClass('fa-compress');
        } else {
          docViewer.removeClass('ks-expanded');
          $(this).find('.ks-icon').removeClass('fa-compress').addClass('fa-expand');
        }
      });

      /**
       * Set fixed height to blocks
       */
      $('[data-height]').each(function () {
        $(this).height($(this).data('height'));
      });

      /**
       * Set auto height for blocks
       */
      $('[data-auto-height]').each(function () {
        var self = $(this);
        var autoHeight = self.data('auto-height');
        var height = $(window).height() - self.offset().top;
        var fixHeight = parseInt(self.data('fix-height'), 10);
        var reduceHeight = self.data('reduce-height');

        if (autoHeight) {
          if (autoHeight == 'parent') {
            height = self.parent().height();
          } else {
            height = self.closest(autoHeight).height();
          }
        } else {
          if (reduceHeight) {
            $.each(self.parent().find(reduceHeight), function (index, element) {
              height -= $(element).height();
            });
          }

          if (fixHeight > 0 && height > 0) {
            height -= fixHeight;
          }

          if (height <= 0) {
            if (self.data('min-height')) {
              height = parseInt(self.data('min-height'), 10);
            } else {
              height = 200;
            }
          }
        }

        self.height(height);
      });

      /**
       * Add scroll to blocks
       */
      $('.ks-scrollable').each(function (index, item) {
        $(item).jScrollPane({
          autoReinitialise: true,
          autoReinitialiseDelay: 100
        });
      });

      /**
       * Toggle hidden responsive menus
       */
      $('[data-block-toggle]').on('click', function () {
        var self = $(this);
        var query = $(this).data('block-toggle');
        var block = $(query);

        self.toggleClass('ks-open');
        block.toggleClass('ks-open');
      });

      /**
       * Make Responsive Horizontal Navigation
       * @type {*|jQuery|HTMLElement}
       */
      if ($('.ks-navbar-horizontal').size()) {
        var ksNavbarHorizontalResponsiveDropdown = $('.ks-navbar-horizontal > .nav > .ks-navbar-horizontal-responsive');
        var ksNavbarHorizontalWidth = $('.ks-navbar-horizontal > .nav').width() + 60;
        var ksNavbarHorizontalScrollWidth = $('.ks-navbar-horizontal').get(0).scrollWidth;

        if (ksNavbarHorizontalScrollWidth > ksNavbarHorizontalWidth) {
          ksNavbarHorizontalWidth -= 220;

          var menuItems = $('.ks-navbar-horizontal > .nav > .nav-item:not(.ks-navbar-horizontal-responsive)');
          var menuItemsLength = menuItems.length;

          for (var i = menuItemsLength; i >= 0; i--) {
            var element = menuItems.get(i);
            var elementWidth = $(element).width();

            if ((ksNavbarHorizontalScrollWidth - elementWidth) > ksNavbarHorizontalWidth) {
              ksNavbarHorizontalScrollWidth -= elementWidth;
              var clone = $(element).clone();

              clone.find('.dropdown-toggle').on('click', function (e) {
                $(this).closest('.dropdown').toggleClass('show');

                return false;
              });

              clone.removeClass('nav-item').addClass('dropdown-item');
              $('.ks-navbar-horizontal-responsive > .dropdown-menu').prepend(clone);

              $(element).remove();
            }
          }

          ksNavbarHorizontalResponsiveDropdown.show();
        }
      }

      /**
       * Toggle sidebar
       */
      $('.ks-sidebar-checkbox-toggle :checkbox').on('change', function () {
        $('.ks-sidebar-toggle').trigger('click');
      });
      $(window).trigger('resize');
    });
  }

  contractNumberFormControl = new FormControl('', [Validators.required]);
  contractNameFormControl = new FormControl('', [Validators.required]);
  responsiblePartyFormControl = new FormControl('', [Validators.required]);
  contractStartDateFormControl = new FormControl('', [Validators.required]);
  contractEndDateFormControl = new FormControl('', [Validators.required]);
  initialDepositFormControl = new FormControl('', [Validators.required]);
  payrollIdFormControl = new FormControl('', [Validators.required]);
  tinFormControl = new FormControl('', [Validators.required]);
  percentRetainedFormControl = new FormControl('', [Validators.required]);

  totalLoansFormControl = new FormControl('', );
  totalToSettleFormControl = new FormControl('', );
  currentPayPeriodFormControl = new FormControl('', );

  private validateRequired(): boolean {
    if (!this.contractNumberFormControl.invalid.valueOf()
      && !this.contractNameFormControl.invalid.valueOf()
      && !this.responsiblePartyFormControl.invalid.valueOf()
      && !this.contractStartDateFormControl.invalid.valueOf()
      && !this.contractEndDateFormControl.invalid.valueOf()
      && !this.initialDepositFormControl.invalid.valueOf()
      && !this.payrollIdFormControl.invalid.valueOf()
      && !this.tinFormControl.invalid.valueOf()
      && !this.percentRetainedFormControl.invalid.valueOf()
    ) {
      return true;
    }
    else
      return false;
  }

  addNewContract() {
    this.currentContract = new CurrentContract();
    this.currentContract.contractId = 0;
    this.assignedDrivers = new Array<AssignedDriver>();
    this.assignedTrucks = new Array<AssignedTruck>();
    this.assignedFinanceAgreements = new Array<AssignedFinanceAgreement>();
  }


  saveContract() {
    if (this.validateRequired()) {
      this.contractService.saveContract(this.currentContract, this.currentUser).subscribe(driverdata => {
        this.saveMessage = "Contract information saved successfully.";
        this.messageType = "success";
      });
    }
    else {
      this.saveMessage = "Please provide required data.";
      this.messageType = "error";
    }
  }

  print() {
    let printContents, popupWin;
    printContents = document.getElementById('tab4').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
      <head>
        <title>Print tab</title>
        <style>
        //........Customized style.......
        </style>
      </head>
       <body onload="window.print();window.close()">${printContents}</body>
    </html>`
    );
    popupWin.document.close();
  }
  assignCopy() {
    this.filteredItems = Object.assign([], this.contracts);
  }
  filterItem() {
    if (!this.contractFullName) this.assignCopy(); //when nothing has typed
    this.filteredItems = Object.assign([], this.contracts).filter(
      item => item.contractName.toString().toLowerCase().indexOf(this.contractFullName.toString().toLowerCase()) > -1
        || item.contractNumber.toString().toLowerCase().indexOf(this.contractFullName.toString().toLowerCase()) > -1
    )
    if (this.filteredItems.length == 0) {
      this.saveMessage = "Contract not found!!!";
      this.messageType = "info";
    }
    else {
      this.saveMessage = "";
      this.messageType = "info";
    }
    this.sidebar.ParseList<ContractList>(this.filteredItems, (x) => x.contractName, (x) => x.contractId);
  }

  //#region Dialogs Update
  // Grid CRUD Operation (Add/Edit/Delete)
  addAssignTruckDialog(): void {
    let truck = new AssignedTruck;
    truck.truckId = 0;
    let truckDialogRef = this.dialog.open(ContractTruckAssignDialog, {
      width: '300px',
      height: '365px',
      data: { title: 'Add Truck Assign Detail', 
      truckId: truck.truckId,
      truckNumber: truck.truckNumber,
      startDate: truck.startDate,
      endDate: truck.endDate,
      truckList: this.truckList
     }
    });

    truckDialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let truckAssign = new AssignedTruck;
        truckAssign.truckId = result.truckId;
        truckAssign.truckNumber = result.truckNumber;
        truckAssign.startDate = result.startDate;
        truckAssign.endDate = result.endDate;

        this.assignedTrucks.push(truckAssign);
        this.saveMessage = "Contract information have unsaved changes.";
        this.messageType = "info";
      }
    });
  }
  editAssignTruckDialog(truck: AssignedTruck) {
    let truckDialogRef = this.dialog.open(ContractTruckAssignDialog, {
      width: '340px',
      height: '365px',
      data: { title: 'Update Assigned Truck Detail',
      truckId: truck.truckId,
      truckNumber: truck.truckNumber,
      startDate: truck.startDate,
      endDate: truck.endDate,
      truckList: this.truckList
       }
    });

    truckDialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let truckAssign = new AssignedTruck;
        truckAssign.truckId = result.truckId;
        truckAssign.truckNumber = result.truckNumber;
        truckAssign.startDate = result.startDate;
        truckAssign.endDate = result.endDate;

        let updateItem = this.assignedTrucks.find(this.findTruckAssignIndexToUpdate, truckAssign.truckId);

        let index = this.assignedTrucks.indexOf(updateItem);

        this.assignedTrucks[index] = truckAssign;
        this.saveMessage = "Contract information have unsaved changes.";
        this.messageType = "info";
      }
    });
  }
  deleteAssignTruckDialog(truck: AssignedTruck): void {
    let confirmDialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: { title: 'Are you confirm to delete assigned truck?', truck: truck }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let truckAssign = new AssignedTruck;
        truckAssign.truckId = result.truck.truckId;
        truckAssign.truckNumber = result.truck.truckNumber;
        truckAssign.startDate = result.truck.startDate;
        truckAssign.endDate = result.truck.endDate;

        let updateItem = this.assignedTrucks.find(this.findTruckAssignIndexToUpdate, truckAssign.truckId);
        let index = this.assignedTrucks.indexOf(updateItem);
        this.assignedTrucks.splice(index, 1);

        this.saveMessage = "Contract information have unsaved changes.";
        this.messageType = "info";
      }
    });
  }
  // Grid CRUD Operation (Add/Edit/Delete)
  addAssignDriverDialog(): void {
    let driver = new AssignedDriver;
    driver.driverId = 0;
    let driverDialogRef = this.dialog.open(ContractDriverAssignDialog, {
      width: '300px',
      height: '370px',
      data: { title: 'Add Driver Assign Detail',
      driverId: driver.driverId,
      driverFullName: driver.driverFullName,
      startDate: driver.startDate,
      endDate: driver.endDate
       }
    });

    driverDialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let driverAssign = new AssignedDriver;
        driverAssign.driverId = result.driverId;
        driverAssign.driverFullName = result.driverFullName;
        driverAssign.startDate = result.startDate;
        driverAssign.endDate = result.endDate;

        this.assignedDrivers.push(driverAssign);
        this.saveMessage = "Contract information have unsaved changes.";
        this.messageType = "info";
      }
    });
  }
  editAssignDriverDialog(driver: AssignedDriver) {
    let driverDialogRef = this.dialog.open(ContractDriverAssignDialog, {
      width: '300px',
      height: '370px',
      data: { title: 'Update Assigned Driver', 
      driverId: driver.driverId,
      driverFullName: driver.driverFullName,
      startDate: driver.startDate,
      endDate: driver.endDate
     }
    });

    driverDialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let driverAssign = new AssignedDriver;
        driverAssign.driverId = result.driverId;
        driverAssign.driverFullName = result.driverFullName;
        driverAssign.startDate = result.startDate;
        driverAssign.endDate = result.endDate;

        let updateItem = this.assignedDrivers.find(this.findDriverAssignIndexToUpdate, driverAssign.driverId);

        let index = this.assignedDrivers.indexOf(updateItem);

        this.assignedDrivers[index] = driverAssign;
        this.saveMessage = "Contract information have unsaved changes.";
        this.messageType = "info";
      }
    });
  }
  deleteAssignDriverDialog(driver: AssignedDriver): void {
    let confirmDialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: { title: 'Are you confirm to delete assigned driver?', driver: driver }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let driverAssign = new AssignedDriver;
        driverAssign.driverId = result.driver.driverId;
        driverAssign.driverFullName = result.driver.driverFullName;
        driverAssign.startDate = result.driver.startDate;
        driverAssign.endDate = result.driver.endDate;

        let updateItem = this.assignedDrivers.find(this.findDriverAssignIndexToUpdate, driverAssign.driverId);

        let index = this.assignedDrivers.indexOf(updateItem);
        this.assignedDrivers.splice(index, 1);

        this.saveMessage = "Contract information have unsaved changes.";
        this.messageType = "info";
      }
    });
  }


  // Grid CRUD Operation Loan Assigned (Add/Edit/Delete)
  addAssignLoanDialog(): void {
    let loan = new AssignedFinanceAgreement;
    loan.contractFinanceAgreementId = 0;
    let driverDialogRef = this.dialog.open(ContractLoanAssignDialog, {
      width: '900px',
      height: '590px',
      data: { title: 'Add Finanace Agreement Detail', 
      contractFinanceAgreementId: loan.contractFinanceAgreementId, 
      loanAmount: loan.loanAmount, 
      remainingBalance: loan.remainingBalance, 
      financeTypeName: loan.financeTypeName, 
      financeAgreementName: loan.financeAgreementName, 
      paymentAmount: loan.paymentAmount, 
      startDate: loan.startDate, 
      endDate: loan.endDate,  
      financeType: this.financeTypeList }
    });

    driverDialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let driverAssign = new AssignedFinanceAgreement;
        driverAssign.contractFinanceAgreementId = result.contractFinanceAgreementId;
        driverAssign.financeAgreementName = result.financeAgreementName;
        driverAssign.financeTypeName = result.financeTypeName;
        driverAssign.loanAmount= result.loanAmount, 
        driverAssign.remainingBalance=result.remainingBalance, 
        driverAssign.paymentAmount = result.paymentAmount;
        driverAssign.startDate = result.startDate;
        driverAssign.endDate = result.endDate;

        this.assignedFinanceAgreements.push(driverAssign);
        this.saveMessage = "Contract information have unsaved changes.";
        this.messageType = "info";
      }
    });
  }
  editAssignLoanDialog(loan: AssignedFinanceAgreement) {
    let driverDialogRef = this.dialog.open(ContractLoanAssignDialog, {
      width: '900px',
      height: '590px',
      data: { title: 'Update Finance Agreement Detail', 
      contractFinanceAgreementId: loan.contractFinanceAgreementId, 
      loanAmount: loan.loanAmount, 
      remainingBalance: loan.remainingBalance, 
      financeTypeName: loan.financeTypeName, 
      financeAgreementName: loan.financeAgreementName, 
      paymentAmount: loan.paymentAmount, 
      startDate: loan.startDate, 
      endDate: loan.endDate, 
      financeType: this.financeTypeList }
    });

    driverDialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let driverAssign = new AssignedFinanceAgreement;
        driverAssign.contractFinanceAgreementId = result.contractFinanceAgreementId;
        driverAssign.financeTypeName = result.financeTypeName;
        driverAssign.loanAmount= result.loanAmount, 
        driverAssign.remainingBalance=result.remainingBalance, 
        driverAssign.financeAgreementName = result.financeAgreementName;
        driverAssign.paymentAmount = result.paymentAmount;
        driverAssign.startDate = result.startDate;
        driverAssign.endDate = result.endDate;

        let updateItem = this.assignedFinanceAgreements.find(this.findLoanAssignIndexToUpdate, driverAssign.contractFinanceAgreementId);

        let index = this.assignedFinanceAgreements.indexOf(updateItem);

        this.assignedFinanceAgreements[index] = driverAssign;
        this.saveMessage = "Contract information have unsaved changes.";
        this.messageType = "info";
      }
    });
  }
  deleteAssignLoanDialog(loan: AssignedFinanceAgreement): void {
    let confirmDialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: { title: 'Are you confirm to delete assigned agreement?', loan: loan }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let driverAssign = new AssignedFinanceAgreement;
        driverAssign.loanAmount= result.loan.loanAmount, 
        driverAssign.remainingBalance=result.loan.remainingBalance,
        driverAssign.contractFinanceAgreementId = result.loan.contractFinanceAgreementId;
        driverAssign.financeTypeName = result.loan.financeTypeName;
        driverAssign.financeAgreementName = result.loan.financeAgreementName;
        driverAssign.paymentAmount = result.loan.paymentAmount;
        driverAssign.startDate = result.loan.startDate;
        driverAssign.endDate = result.loan.endDate;

        let updateItem = this.assignedFinanceAgreements.find(this.findLoanAssignIndexToUpdate, driverAssign.contractFinanceAgreementId);

        let index = this.assignedFinanceAgreements.indexOf(updateItem);
        this.assignedFinanceAgreements.splice(index, 1);

        this.saveMessage = "Contract information have unsaved changes.";
        this.messageType = "info";
      }
    });
  }

  findTruckAssignIndexToUpdate(newItem) {
    return newItem.truckId === this;
  }
  findDriverAssignIndexToUpdate(newItem) {
    return newItem.driverId === this;
  }
  findLoanAssignIndexToUpdate(newItem) {
    return newItem.contractFinanceAgreementId === this;
  }

  //#endregion

  //#region Load data
  selectContract(contractId: number) {
    this.loadContractInfo(contractId);
  }
  // Selected list item show active.
  isActive(contractId: number) {
    if (this.currentContract.contractId == contractId) {
      return true;
    }
    return false;
  }

  selectPreContract() {
    for (var i = 0; i < this.contracts.length - 1; i++) {
      if (this.contracts[i].contractId == this.currentContract.contractId) {
        if (i != 0) {
          this.loadContractInfo(this.contracts[i - 1].contractId);
        }
      }
    }
  }
  selectNextContract() {
    for (var i = 0; i < this.contracts.length - 1; i++) {
      if (this.contracts[i].contractId == this.currentContract.contractId) {
        if (i != this.contracts.length - 1) {
          this.loadContractInfo(this.contracts[i + 1].contractId);
        }
      }
    }
  }
  private loadContractInfo(contractId: number) {
    this.contractService.getContractInfo(contractId.toString(), this.currentUser).subscribe(contract => {
      this.contractInfo = contract;
      if (this.contractInfo.isCompletedSuccessfully) {
        this.currentContract = this.contractInfo.result.currentContract;
        this.assignedDrivers = this.currentContract.assignedDrivers;
        this.assignedTrucks = this.currentContract.assignedTrucks;
        this.assignedFinanceAgreements = this.currentContract.assignedFinanceAgreements;

        // this.updatePhoneType();
        this.saveMessage = "";
        this.messageType = "info";
      }
    });
  }
  private loadContractList(contractId: number) {
    this.contractService.getContractList(contractId.toString(), this.currentUser).subscribe(contractdata => {
      this.contractListObj = contractdata;
      this.contracts = this.contractListObj.contractList;
      this.sidebar.ParseList<ContractList>(this.contracts, (x) => x.contractName, (x) => x.contractId);
      this.loadContractInfo(this.contracts[0].contractId);
      this.assignCopy();
    });
  }
  private loadContractLookup() {
    this.contractService.getContractLookup(this.currentUser).subscribe(contractLookupdata => {
      this.contractLookupModel = contractLookupdata;
      this.financeTypeList = this.contractLookupModel.financeTypes;
      this.truckList = this.contractLookupModel.trucks;

      this.logoData = 'data:image/jpg;base64,' + this.contractLookupModel.logoData;
    });
  }

  //#endregion
}
