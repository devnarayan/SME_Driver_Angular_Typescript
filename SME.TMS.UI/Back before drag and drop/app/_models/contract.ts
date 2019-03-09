
export class ContractList {
    contractId: number;
    contractName: string;
    contractNumber: string;
}

export class ContractListModel {
    contractList: ContractList[];
}

export class FinanceType {
    financeTypeId: number;
    financeTypeName: string;
    isActive: boolean;
    createdBy: string;
    createdDate: Date;
    modifiedBy: string;
    modifiedDate: Date;
}
export class Truck {
    truckId: number;
    truckNumber: string;
}


export class ContractLookupModel {
    financeTypes: FinanceType[];
    trucks: Truck[];
    logoData: string;
}


export class AssignedDriver {
    driverId: number;
    driverFullName: string;
    startDate: Date;
    endDate?: any;
}

export class AssignedTruck {
    truckId: number;
    truckNumber: string;
    startDate: Date;
    endDate?: any;
}

export class AssignedFinanceAgreement {
    contractFinanceAgreementId: number;
    financeTypeName: string;
    financeAgreementName: string;
    paymentAmount: number;
    loanAmount: number;
    remainingBalance: number;
    startDate: Date;
    endDate: Date;
}

export class CurrentContract {
    contractId?: number;
    accountingContractId?: number;
    contractName?: string;
    contractNumber?: string;
    contractStartDate?: Date;
    contractEndDate?: Date;
    isActive?: boolean;
    createdBy?: any;
    createdDate?: Date;
    modifiedBy?: any;
    modifiedDate?: Date;
    responsibleParty?: string;
    tin?: string;
    payrollId?: string;
    isDirectDeposit?: boolean;
    is1099Vendor?: boolean;
    initialDeposit?: number;
    percentRetained?: number;
    currentPayPeriod?: Date;
    totalLoans?: number;
    totalToSettle?: number;
    assignedDrivers?: AssignedDriver[];
    assignedTrucks?: AssignedTruck[];
    assignedFinanceAgreements?: AssignedFinanceAgreement[];


}

export class Result {
    currentContract: CurrentContract;
}

export class ContractRootObject {
    result: Result;
    id: number;
    exception?: any;
    status: number;
    isCanceled: boolean;
    isCompleted: boolean;
    isCompletedSuccessfully: boolean;
    creationOptions: number;
    asyncState?: any;
    isFaulted: boolean;
}
declare let jquery: any;
declare let $: any;
export class CommonFunction {

    public inittt(): any {
        alert('hi')
        $(document).ready(function () {
            let ksBody = $('.body');
            let ksSidebar = $('.ks-sidebar');
            let ksSidebarToggle = $('.ks-sidebar-toggle');
            let ksSidebarMobileToggle = $('.ks-sidebar-mobile-toggle');
            let isSidebarFixed = ksBody.hasClass('ks-sidebar-fixed');
            let isSidebarCompact = ksBody.hasClass('ks-sidebar-compact');
            let ksMobileOverlay = $('.ks-mobile-overlay');
            let ksNavbarMenu = $('.ks-navbar-menu');
            let ksNavbarMenuToggle = $('.ks-navbar-menu-toggle');
            let ksNavbarActions = $('.ks-navbar .ks-navbar-actions');
            let ksNavbarActionsToggle = $('.ks-navbar-actions-toggle');
            let ksSearchOpen = $('.ks-search-open');
            let ksSearchClose = $('.ks-search-close');
            let ksSettingsSlideControl = $('.ks-settings-slide-control');
            let ksSettingsSlideCloseControl = $('.ks-settings-slide-close-control');



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
                let self = $(this);

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
                let self = $(this);

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
                let self = $(this);
                alert('OPEN')

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
                let self = $(this);
                let parent = self.closest('.dropdown');
                e.stopPropagation();
                e.preventDefault();

                parent.toggleClass('show');
            });

            $(document).on('change', '.btn-file :file', function (e) {
                let input = $(this);
                let label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
                $(e.target).closest('.btn').find('.text').text(label);
            });

            $('.ks-document-viewer .ks-view-toggle').on('click', function () {
                let docViewer = $(this).closest('.ks-document-viewer');

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
                let self = $(this);
                let autoHeight = self.data('auto-height');
                let height = $(window).height() - self.offset().top;
                let fixHeight = parseInt(self.data('fix-height'), 10);
                let reduceHeight = self.data('reduce-height');

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
                let self = $(this);
                let query = $(this).data('block-toggle');
                let block = $(query);

                self.toggleClass('ks-open');
                block.toggleClass('ks-open');
            });

            /**
             * Make Responsive Horizontal Navigation
             * @type {*|jQuery|HTMLElement}
             */
            if ($('.ks-navbar-horizontal').size()) {
                let ksNavbarHorizontalResponsiveDropdown = $('.ks-navbar-horizontal > .nav > .ks-navbar-horizontal-responsive');
                let ksNavbarHorizontalWidth = $('.ks-navbar-horizontal > .nav').width() + 60;
                let ksNavbarHorizontalScrollWidth = $('.ks-navbar-horizontal').get(0).scrollWidth;

                if (ksNavbarHorizontalScrollWidth > ksNavbarHorizontalWidth) {
                    ksNavbarHorizontalWidth -= 220;

                    let menuItems = $('.ks-navbar-horizontal > .nav > .nav-item:not(.ks-navbar-horizontal-responsive)');
                    let menuItemsLength = menuItems.length;

                    for (let i = menuItemsLength; i >= 0; i--) {
                        let element = menuItems.get(i);
                        let elementWidth = $(element).width();

                        if ((ksNavbarHorizontalScrollWidth - elementWidth) > ksNavbarHorizontalWidth) {
                            ksNavbarHorizontalScrollWidth -= elementWidth;
                            let clone = $(element).clone();

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

}