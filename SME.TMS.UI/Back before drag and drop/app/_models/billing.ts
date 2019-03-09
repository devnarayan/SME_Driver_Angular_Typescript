
export class Vendor {
    vendorId: number;
    vendorName: string;
}

export class BillingLookupRootObject {
    vendors?: Vendor[];
    logoData?: string;
}

export class Invoice {
    invoiceId: number;
    trackingIdNumber: string;
    dispatchLoadNumber: number;
    driverRate: number;
    driverFuelSurcharge: number;
    vendorId: number;
    manufacturerRate: number;
    manufacturerFuelSurcharge: number;
    terminal: number;
    deliveryDate: Date;
    truckId: number;
    truckNumber?: any;
    isAcknowledged: boolean;
    isDeleted: boolean;
    driver?: any;
}

export class InvoiceRootObject {
    vendorId?: number;
    invoices?: Invoice[];
    totalVendors?: number;
    totalOutstandingBalance?: number;
    completionPercentage?: number;
}


export class CashReceipt {
    cashReceiptId: number;
    trackingIdNumber: string;
    dispatchLoadNumber: number;
    driverRate: number;
    driverFuelSurcharge: number;
    vendorId: number;
    manufacturerRate: number;
    manufacturerFuelSurcharge: number;
    terminal: number;
    paymentDate: Date;
    paymentNumber: string;
    truckId?: any;
    truckNumber?: any;
    isReconciled: boolean;
    isDeleted: boolean;
    driver?: any;
}

export class CashRootObject {
    cashReceipts?: CashReceipt[];
    totalVendors?: number;
    totalOutstandingBalance?: number;
    completionPercentage?: number;
    vendorId?: number;
}

