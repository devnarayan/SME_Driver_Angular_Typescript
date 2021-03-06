import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../_models/index';
import { UserService, BillingService } from '../_services/index';
import { CashReceipt, CashRootObject, Vendor, BillingLookupRootObject } from '../_models/billing';
import { DataTable, DataTableTranslations, DataTableResource } from 'angular-4-data-table-bootstrap-4';
import { cash } from '../_datatables/cash/data-table-cash-data';
import { Jsonp } from '@angular/http/src/http';
import { fadeInContent } from '@angular/material/typings/select/select-animations';
import { InvoiceBillingDialog } from '../dialogs/billing/invoice.billing.dialog';
import { ConfirmDialog } from '../dialogs/confirm.dialog';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CashBillingDialog } from '../dialogs/billing/cash.billing.dialog';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css']
})

export class CashComponent implements OnInit {
  currentUser: User;
  saveMessage: string;
  messageType: string;
  tabTitle: string;
  driverFullName: string;
  form: FormGroup;
  vendorSearch: string;

  vendorList: Vendor[] = [];
  filteredItems: Vendor[] = [];
  lookupObj: BillingLookupRootObject = {};
  cashList: CashReceipt[] = [];
  filterCashList: CashReceipt[] = [];
  cashRootObj: CashRootObject = {};

  cutoffDate: Date;
  cashSearch: string;

  invoiceResource = new DataTableResource([]);
  filmCount = 0;
  @ViewChild(DataTable) cashTable;
  @ViewChild('sidebar') sidebar: SidebarComponent;

  logoData = '';

  constructor(fb: FormBuilder, private userService: UserService, private billingService: BillingService, public dialog: MdDialog) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.invoiceResource.count().then(count => this.filmCount = count);
  }

  ngOnInit() {
    this.tabTitle = "Cash Receipt";
    this.loadVendorLookupInfo();
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
  assignCopy() {
    this.filteredItems = Object.assign([], this.vendorList);
  }
  filterItem() {
    if (!this.vendorSearch) this.assignCopy(); //when nothing has typed
    this.filteredItems = Object.assign([], this.vendorList).filter(
      item => item.vendorName.toString().toLowerCase().indexOf(this.vendorSearch.toString().toLowerCase()) > -1
        || item.vendorName.toString().toLowerCase().indexOf(this.vendorSearch.toString().toLowerCase()) > -1
    )
    if (this.filteredItems.length == 0) {
      this.saveMessage = "Vendors not found!!!";
      this.messageType = "info";
    }
    else {
      this.saveMessage = "";
      this.messageType = "info";
    }
    this.sidebar.ParseList<Vendor>(this.filteredItems, (x) => x.vendorName, (x) => x.vendorId);
  }
  changeCutoffDate(newDate) {
    this.sortInvoiceList();
  }
  filterInvoice() {
    this.sortInvoiceList();
  }
  assignCashList() {
    this.filterCashList = Object.assign([], this.cashList);
  }
  private sortInvoiceList() {

    if (this.cutoffDate == undefined && this.cashSearch.length == 0) {
      this.assignCashList(); //when nothing has typed
    }
    else if (this.cutoffDate == undefined) {
      this.filterCashList = Object.assign([], this.cashList).filter(
        item => (item.trackingIdNumber.toString().toLowerCase().indexOf(this.cashSearch.toString().toLowerCase()) > -1
          || item.dispatchLoadNumber.toString().toLowerCase().indexOf(this.cashSearch.toString().toLowerCase()) > -1
        )
      )
    }
    else {
      this.filterCashList = Object.assign([], this.cashList).filter(
        item => (new Date(item.paymentDate).getTime() <= this.cutoffDate.getTime())
          &&
          (item.trackingIdNumber.toString().toLowerCase().indexOf(this.cashSearch.toString().toLowerCase()) > -1
            || item.dispatchLoadNumber.toString().toLowerCase().indexOf(this.cashSearch.toString().toLowerCase()) > -1
          )
      )
    }
    if (this.filteredItems.length == 0) {
      this.saveMessage = "Cash receipt not found!!!";
      this.messageType = "info";
    }
    else {
      this.saveMessage = "";
      this.messageType = "info";
    }
  }

  refresh() {
    this.cutoffDate = undefined;
    this.cashSearch = "";
    this.sortInvoiceList();
  }

  selectTab(tabName: string): void {
    this.tabTitle = tabName;
  }
  selectPreVendor() {
    for (var i = 0; i < this.vendorList.length - 1; i++) {
      if (this.vendorList[i].vendorId == this.cashRootObj.vendorId) {
        if (i != 0) {
          this.loadVendorInfo(this.vendorList[i - 1].vendorId);
        }
      }
    }
  }
  selectNextVendor() {
    for (var i = 0; i < this.vendorList.length - 1; i++) {
      if (this.vendorList[i].vendorId == this.cashRootObj.vendorId) {
        if (i != this.vendorList.length - 1) {
          this.loadVendorInfo(this.vendorList[i + 1].vendorId);
        }
      }
    }
  }
  print() {
  }

  importToGP() {
    let bl: boolean;
    bl = false;
    this.cashList.forEach(element => {
      this.cashTable.selectedRows.forEach(selected => {
        if (element.cashReceiptId == selected.item.cashReceiptId) {
          element.isReconciled = true;
          bl = true;
        }
      });
    });
    if (bl) {
      this.billingService.saveCashReceiptList(this.cashList, this.currentUser).subscribe(driverdata => {
        this.saveMessage = "Cash receipts imported to GP successfully.";
        this.messageType = "success";
      });
    }
    else {
      this.saveMessage = "Please select cash receipt to import in GP.";
      this.messageType = "error";
    }
  }
  editCashDialog(item: CashReceipt) {
    let driverDialogRef = this.dialog.open(CashBillingDialog, {
      width: '550px',
      height: '550px',
      data: {
        title: 'Update Cash Receipt Detail',
        cash: item
      }
    });

    driverDialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let cashModel = new CashReceipt;
        // Update info to push in database.
        this.billingService.saveCashReceiptList(this.cashList, this.currentUser).subscribe(driverdata => {
          this.saveMessage = "Cash receipt updated successfully.";
          this.messageType = "success";
        });
      }
    });
  }
  deleteCashDialog(cash: CashReceipt): void {
    let confirmDialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: { title: 'Are you confirm to delete cash receipt?', cash: cash }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let cashModel = new CashReceipt;
        cashModel = result.cash;

        this.cashList.forEach(element => {
          if (element.cashReceiptId == cashModel.cashReceiptId) {
            element.isDeleted = true;
          }
        });
        this.billingService.saveCashReceiptList(this.cashList, this.currentUser).subscribe(driverdata => {
          this.saveMessage = "Cash Receipt deleted successfully.";
          this.messageType = "success";

          let updateItem = this.cashList.find(this.findInvoiceIndexToUpdate, cashModel.cashReceiptId);
          let index = this.cashList.indexOf(updateItem);
          this.cashList.splice(index, 1);
        });
      }
    });
  }
  findInvoiceIndexToUpdate(newItem) {
    return newItem.cashReceiptId === this;
  }

  selectVendor(vendorId: number) {
    this.loadVendorInfo(vendorId);
  }
  isActive(vendorId: number) {
    if (this.cashRootObj.vendorId == vendorId) {
      return true;
    }
    return false;
  }
  private loadVendorLookupInfo() {
    this.billingService.getInvoiceLookup(this.currentUser).subscribe(vendorInfo => {
      this.lookupObj = vendorInfo;
      if (this.lookupObj.vendors.length > 0) {
        this.vendorList = this.lookupObj.vendors;
        this.sidebar.ParseList<Vendor>(this.vendorList, (x) => x.vendorName, (x) => x.vendorId);
        this.loadVendorInfo(this.vendorList[0].vendorId);
        this.assignCopy();
        this.saveMessage = "";
        this.messageType = "info";
        this.logoData = 'data:image/jpg;base64,' + this.lookupObj.logoData;
      }
    });
  }
  private loadVendorInfo(vendorId: number) {
    this.billingService.getCashReceiptList(vendorId.toString(), this.currentUser).subscribe(vendor => {
      this.cashRootObj = vendor;
      this.cashRootObj.vendorId = vendorId;
      this.cashList = this.cashRootObj.cashReceipts;
      this.assignCashList();
      this.saveMessage = "";
      this.messageType = "info";

      this.invoiceResource = new DataTableResource(this.filterCashList);
      this.invoiceResource.count().then(count => this.filmCount = count);
    });
  }

  reloadInvoice(params) {
    this.invoiceResource.query(params).then(invoices => this.filterCashList = invoices);
  }

  // special params:
  translations = <DataTableTranslations>{
    indexColumn: 'Index column',
    expandColumn: 'Expand column',
    selectColumn: 'Select column',
    paginationLimit: 'Max results',
    paginationRange: 'Result range'
  };
}