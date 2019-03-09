using SME.TMS.API.Interface;
using SME.TMS.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Workflows.Interfaces
{
    public interface IPaymentWorkflow
    {
        // Invoice methods.
        Task<List<InvoiceModel>> SaveInvoiceList(PortalUser currentUser, List<InvoiceModel> invoiceList);
        Task<InvoiceModel> SaveInvoice(PortalUser currentUser, InvoiceModel invoice);
        InvoiceModel LoadInvoice(Invoice invoice);

        // Cash receipt methods.
        Task<List<CashReceiptModel>> SaveCashReceiptList(PortalUser currentUser, List<CashReceiptModel> cashReceiptList);
        Task<CashReceiptModel> SaveCashReceipt(PortalUser currentUser, CashReceiptModel cashReceipt);
        CashReceiptModel LoadCashReceipt(CashReceipt cashReceipt);
    }
}
