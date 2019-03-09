using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SME.TMS.API.Interface;
using SME.TMS.API.Models;
using SME.TMS.API.Repo;
using SME.TMS.API.Workflows.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Workflows
{
    public class PaymentWorkflow : IPaymentWorkflow
    {
        private readonly IDriverRepository repository;

        public PaymentWorkflow(IDriverRepository repository)
        {
            this.repository = repository;
        }

        /// <summary>
        /// This method is used to iterate over a list of invoices to update/insert them all in one call.
        /// Will be performed in a single transaction meanging any errors will rollback.
        /// </summary>
        /// <param name="currentUser">The user performing the action.</param>
        /// <param name="invoiceList">The list of invoices that need updated or inserted.</param>
        /// <exception cref="NullReferenceException">When updating/inserting an invoice, a driver or invoice was not found. Check inner exception.</exception>
        /// <exception cref="UnauthorizedAccessException">If one element attempt to update without the user having proper permissions.</exception>
        /// <exception cref="Exception">This generic exception occurs when something unpredictable happens. Check inner exception for details.</exception>
        /// <returns>Returns the list with the updated data in it.</returns>
        public async Task<List<InvoiceModel>> SaveInvoiceList(PortalUser currentUser, List<InvoiceModel> invoiceList)
        {
            using (var transaction = await repository.StartTransaction())
            {
                try
                {
                    for (int i = 0; i < invoiceList.Count; i++)
                    {

                        try
                        {
                            if (invoiceList[i].IsDeleted)
                                continue;
                            var result = await SaveInvoice(currentUser, invoiceList[i]);
                            result.IsAcknowledged = invoiceList[i].IsAcknowledged;
                            invoiceList[i] = result;
                        }
                        catch (NullReferenceException e)
                        {
                            throw new NullReferenceException($"Invoice: {invoiceList[i].InvoiceId} Error", e);
                        }
                        catch (UnauthorizedAccessException e)
                        {
                            throw new UnauthorizedAccessException($"Invoice: {invoiceList[i].InvoiceId} is not editable by this user.", e);
                        }
                        catch (Exception e)
                        {
                            throw new Exception("Unknown error occured.", e);
                        }
                    }


                    List<InvoiceModel> acknowledgedInvoices = invoiceList.Where(x => x.IsAcknowledged && !x.IsDeleted).ToList();

                    for (int i = 0; i < acknowledgedInvoices.Count; i++)
                    {

                        try
                        {
                            await AcknowledgeInvoice(currentUser, acknowledgedInvoices[i]);

                        }
                        catch (Exception e)
                        {
                            throw new Exception("Unknown error occured.", e);
                        }
                    }

                    invoiceList.RemoveAll(x => acknowledgedInvoices.Contains(x));

                    List<InvoiceModel> deletedInvoices = invoiceList.Where(x => x.IsDeleted && x.InvoiceId != 0).ToList();

                    try
                    {
                        foreach(InvoiceModel invoice in deletedInvoices)
                        {
                            var dbInvoice = await repository.GetInvoiceById(invoice.InvoiceId);
                            if (dbInvoice.CompanyId != currentUser.CompanyId)
                                continue;

                            if(dbInvoice != null)
                            {
                                await DeleteInvoice(currentUser, dbInvoice.InvoiceId);
                            }
                        }

                        await repository.SaveChanges();
                        invoiceList.RemoveAll(x => deletedInvoices.Contains(x));
                    }catch(Exception e)
                    {
                        throw new Exception("Unknown error occured.", e);
                    }

                    transaction.Commit();
                }
                catch (Exception e)
                {
                    transaction.Rollback();

                    throw;
                }

                return invoiceList;
            }
        }

        /// <summary>
        /// This method will take the data from the invoice model and save it to the database.
        /// A 0 id will denote a new insert. id > 0 will denote updating an existing row.
        /// </summary>
        /// <param name="currentUser">The user performing this action.</param>
        /// <param name="invoice">The invoice data used to update/insert the row.</param>
        /// <exception cref="NullReferenceException">Denotes that either the driver or the invoice was not found.</exception>
        /// <exception cref="UnauthorizedAccessException">Denotes that you tried to update a record that does not belong to the user's company.</exception>
        /// <returns>An invoice model of the updated data for returning to the UI.</returns>
        public async Task<InvoiceModel> SaveInvoice(PortalUser currentUser, InvoiceModel invoice)
        {
            var existingInvoice = await repository.GetInvoiceById(invoice.InvoiceId);

            if (existingInvoice == null & invoice.InvoiceId > 0)
                throw new NullReferenceException("Invoice was not found.");
            else if (existingInvoice == null)
            {
                existingInvoice = new Invoice()
                {
                    CreatedBy = currentUser.PortalUsername,
                    CreatedDate = DateTime.UtcNow,
                    ModifiedBy = currentUser.PortalUsername,
                    ModifiedDate = DateTime.UtcNow
                };
            }
            else if (existingInvoice.CompanyId != currentUser.CompanyId)
                throw new UnauthorizedAccessException("You cannot access this invoice as this user.");

            existingInvoice.CenterId = invoice.Terminal;
            existingInvoice.DeliveryDate = invoice.DeliveryDate;
            existingInvoice.DispatchLoadNumber = invoice.DispatchLoadNumber;
            existingInvoice.DriverFuelSurcharge = invoice.DriverFuelSurcharge;
            existingInvoice.DriverRate = invoice.DriverRate;
            existingInvoice.CompanyId = currentUser.CompanyId;
            existingInvoice.IsActive = true;
            existingInvoice.ManufacturerFuelSurcharge = invoice.ManufacturerFuelSurcharge;
            existingInvoice.ManufacturerId = invoice.VendorId;
            existingInvoice.ManufacturerRate = invoice.ManufacturerRate;
            existingInvoice.VIN = invoice.TrackingIdNumber;
            existingInvoice.TransactionStatusTypeId = (int)TransactionStatusType.Enum.Open;

            if (invoice.Driver != null)
            {
                var driver = invoice.Driver != null ? await repository.GetDriverById(invoice.Driver.DriverId) : null;

                if (driver != null)
                {
                    existingInvoice.DriverId = driver.DriverId;
                }
                else
                    throw new NullReferenceException("Driver was not found");

            }

            var truck = await repository.GetTruckByTruckNumber(invoice.TruckNumber);

            if (truck != null)
            {
                existingInvoice.TruckId = truck.TruckId;
            }

            if (invoice.InvoiceId == 0)
            {
                repository.Insert(existingInvoice);
                await repository.SaveChanges();
                await CreateInvoiceRevision(currentUser, existingInvoice.InvoiceId, "Created");
            }
            else if(repository.IsChanged(existingInvoice))
            {
                existingInvoice.ModifiedBy = currentUser.PortalUsername;
                existingInvoice.ModifiedDate = DateTime.UtcNow;

                repository.Attach(existingInvoice);
                await repository.SaveChanges();
                await CreateInvoiceRevision(currentUser, existingInvoice.InvoiceId, "Updated");
            }

            return LoadInvoice(existingInvoice);
        }

        /// <summary>
        /// Creates a revision based on the Invoice Id provided
        /// </summary>
        /// <param name="invoiceId">The Id of the invoice you would like saved to revisions.</param>
        /// <param name="note">This is a note for the revision to get an idea on what has been revised.</param>
        /// <returns></returns>
        public async Task CreateInvoiceRevision(PortalUser currentUser, int invoiceId, string note)
        {
            Invoice currData = await repository.GetInvoiceById(invoiceId);

            if (currData == null)
                throw new NullReferenceException("Could not find the invoice by id.");

            InvoiceRev invoiceRevision = new InvoiceRev()
            {
                CenterId = currData.CenterId,
                CompanyId = currData.CompanyId,
                DeliveryDate = currData.DeliveryDate,
                DispatchLoadNumber = currData.DispatchLoadNumber,
                DriverFuelSurcharge = currData.DriverFuelSurcharge,
                DriverId = currData.DriverId,
                DriverRate = currData.DriverRate,
                InvoiceId = currData.InvoiceId,
                IsActive = currData.IsActive,
                ManufacturerFuelSurcharge = currData.ManufacturerFuelSurcharge,
                ManufacturerId = currData.ManufacturerId,
                ManufacturerRate = currData.ManufacturerRate,
                TransactionStatusTypeId = currData.TransactionStatusTypeId,
                TruckId = currData.TruckId,
                VIN = currData.VIN,
                Note = note
            };

            List<InvoiceRev> currentRevisions = await repository.GetInvoiceRevListByInvoiceId(invoiceId);

            invoiceRevision.Version = currentRevisions.Count > 0 ? currentRevisions.Max(x => x.Version) + 1 : 1;
            invoiceRevision.RevisedBy = currentUser.PortalUsername;
            invoiceRevision.RevisionDate = DateTime.UtcNow;

            repository.Insert(invoiceRevision);
            await repository.SaveChanges();
        }

        /// <summary>
        /// Starts the acknowledgement processes for an invoice.
        /// </summary>
        /// <param name="invoice">The invoice that has been acknowledged</param>
        /// <returns></returns>
        public async Task AcknowledgeInvoice(PortalUser currentUser, InvoiceModel invoice)
        {
            Invoice dbInvoice = await repository.GetInvoiceById(invoice.InvoiceId);
            dbInvoice.TransactionStatusTypeId = (int)TransactionStatusType.Enum.Acknowledge;
            dbInvoice.ModifiedBy = currentUser.PortalUsername;
            dbInvoice.ModifiedDate = DateTime.UtcNow;

            await repository.SaveChanges();

            await CreateInvoiceRevision(currentUser, invoice.InvoiceId, "Acknowledged");
        }

        /// <summary>
        /// Delete an invoice.
        /// </summary>
        /// <param name="currentUser">The user deleting the invoice</param>
        /// <param name="invoiceId">The id of the invoice</param>
        /// <exception cref="NullReferenceException">This gets thrown when the invoiceId is not found in the database.</exception>
        /// <returns></returns>
        public async Task DeleteInvoice(PortalUser currentUser, int invoiceId)
        {
            // Get the invoice weare gonig to delete
            Invoice invoice = await repository.GetInvoiceById(invoiceId);

            if (invoice == null)
                throw new NullReferenceException("Could not find the invoice to delete.");

            invoice.TransactionStatusTypeId = (int)TransactionStatusType.Enum.Void;

            await repository.SaveChanges();

            // Second we create a delete revision
            await CreateInvoiceRevision(currentUser, invoiceId, "Deleted");

            // Get all the revisions
            var revisions = await repository.GetInvoiceRevListByInvoiceId(invoiceId);

            // Move them over and delete them as we go.
            foreach(InvoiceRev invoiceRev in revisions)
            {
                InvoiceHist newHistory = new InvoiceHist()
                {
                    CenterId = invoiceRev.CenterId,
                    CompanyId = invoiceRev.CompanyId,
                    DeliveryDate = invoiceRev.DeliveryDate,
                    DispatchLoadNumber = invoiceRev.DispatchLoadNumber,
                    DriverFuelSurcharge = invoiceRev.DriverFuelSurcharge,
                    DriverId = invoiceRev.DriverId,
                    DriverRate = invoiceRev.DriverRate,
                    InvoiceHistId = 0,
                    InvoiceId = invoiceRev.InvoiceId,
                    IsActive = invoiceRev.IsActive,
                    ManufacturerFuelSurcharge = invoiceRev.ManufacturerFuelSurcharge,
                    ManufacturerId = invoiceRev.ManufacturerId,
                    ManufacturerRate = invoiceRev.ManufacturerRate,
                    Note = invoiceRev.Note,
                    RevisedBy = invoiceRev.RevisedBy,
                    RevisionDate = invoiceRev.RevisionDate,
                    TransactionStatusTypeId = invoiceRev.TransactionStatusTypeId,
                    TruckId = invoiceRev.TruckId,
                    Version = invoiceRev.Version,
                    VIN = invoiceRev.VIN
                };
                repository.Insert(newHistory);
                repository.Delete(invoiceRev);
            }

            repository.Delete(invoice);

            await repository.SaveChanges();
        }

        /// <summary>
        /// This method is a utility function to cnvert an invoice database model into a invoice DTO
        /// </summary>
        /// <param name="invoice">The database data to be transfered into the returning DTO.</param>
        /// <returns>The DTO with the data provided from the database model.</returns>
        public InvoiceModel LoadInvoice(Invoice invoice)
        {
            InvoiceModel resp = new InvoiceModel()
            {
                DeliveryDate = invoice.DeliveryDate,
                DispatchLoadNumber = invoice.DispatchLoadNumber,
                Driver = null,
                DriverFuelSurcharge = invoice.DriverFuelSurcharge,
                DriverRate = invoice.DriverRate,
                InvoiceId = invoice.InvoiceId,
                ManufacturerFuelSurcharge = invoice.ManufacturerFuelSurcharge,
                ManufacturerRate = invoice.ManufacturerRate,
                Terminal = invoice.CenterId,
                TrackingIdNumber = invoice.VIN,
                VendorId = invoice.ManufacturerId,
                IsAcknowledged = false,
                IsDeleted = false
            };

            //if (invoice.Driver != null)
            //{
            //    resp.Driver = new DriverModel()
            //    {
            //        DriverId = invoice.Driver.DriverId,
            //        DriverFirstName = invoice.Driver.FirstName,
            //        DriverLastName = invoice.Driver.LastName,
            //        DriverFullName = $"{invoice.Driver.FirstName} {invoice.Driver.LastName}"
            //    };
            //}

            if (invoice.Truck != null)
            {
                resp.TruckId = invoice.Truck.TruckId;
                resp.TruckNumber = invoice.Truck.TruckNumber;
            }

            return resp;
        }

        /// <summary>
        /// This method is used to iterate over a list of cash receipts to update/insert them all in one call.
        /// Will be performed in a single transaction meanging any errors will rollback.
        /// </summary>
        /// <param name="currentUser">The user performing the action.</param>
        /// <param name="invoiceList">The list of cash receipts that need updated or inserted.</param>
        /// <exception cref="NullReferenceException">When updating/inserting a cash receipt, a driver or cash receipt was not found. Check inner exception.</exception>
        /// <exception cref="UnauthorizedAccessException">If one element attempt to update without the user having proper permissions.</exception>
        /// <exception cref="Exception">This generic exception occurs when something unpredictable happens. Check inner exception for details.</exception>
        /// <returns>Returns the list with the updated data in it.</returns>
        public async Task<List<CashReceiptModel>> SaveCashReceiptList(PortalUser currentUser, List<CashReceiptModel> cashReceiptList)
        {
            using (var transaction = await repository.StartTransaction())
            {
                try
                {
                    for (int i = 0; i < cashReceiptList.Count; i++) 
                    {

                        try
                        {
                            if (cashReceiptList[i].IsDeleted)
                                continue;

                            var result = await SaveCashReceipt(currentUser, cashReceiptList[i]);
                            result.IsReconciled = cashReceiptList[i].IsReconciled;
                            cashReceiptList[i] = result;

                        }
                        catch (NullReferenceException e)
                        {
                            throw new NullReferenceException($"Cash Receipt: {cashReceiptList[i].CashReceiptId} Error", e);
                        }
                        catch (UnauthorizedAccessException e)
                        {
                            throw new UnauthorizedAccessException($"Cash Receipt: {cashReceiptList[i].CashReceiptId} is not editable by this user.", e);
                        }
                        catch (Exception e)
                        {
                            throw new Exception("Unknown error occured.", e);
                        }
                    }

                    List<CashReceiptModel> reconciledCashReceipts = cashReceiptList.Where(x => x.IsReconciled && !x.IsDeleted).ToList();

                    for (int i = 0; i < reconciledCashReceipts.Count; i++)
                    {

                        try
                        {
                            await ReconcileCashReceipt(currentUser, reconciledCashReceipts[i]);

                        }
                        catch (Exception e)
                        {
                            throw new Exception("Unknown error occured.", e);
                        }
                    }

                    cashReceiptList.RemoveAll(x => reconciledCashReceipts.Contains(x));

                    List<CashReceiptModel> deletedCashReceipts = cashReceiptList.Where(x => x.IsDeleted && x.CashReceiptId != 0).ToList();

                    try
                    {
                        foreach (CashReceiptModel cashReceipt in deletedCashReceipts)
                        {
                            var dbCashReceipt = await repository.GetCashReceiptById(cashReceipt.CashReceiptId);
                            if (dbCashReceipt.CompanyId != currentUser.CompanyId)
                                continue;

                            if (dbCashReceipt != null)
                            {
                                await DeleteCashReceipt(currentUser, cashReceipt.CashReceiptId);
                            }
                        }

                        await repository.SaveChanges();
                        cashReceiptList.RemoveAll(x => deletedCashReceipts.Contains(x));
                    }
                    catch (Exception e)
                    {
                        throw new Exception("Unknown error occured.", e);
                    }

                    transaction.Commit();
                }
                catch (Exception e)
                {
                    transaction.Rollback();

                    throw e;
                }

                return cashReceiptList;
            }
        }

        /// <summary>
        /// This will save the data supplied in cashReciept to the databased as an insert or an update.
        /// A 0 id denotes a new records(insert). An id > 0 will denote a record being updated.
        /// </summary>
        /// <param name="currentUser">The user performing the operation.</param>
        /// <param name="cashReceipt">The data to update the databased with.</param>
        /// <exception cref="NullReferenceException">This exception will be thrown when no driver or cash receipt exists with the data provided.</exception>
        /// <exception cref="UnauthorizedAccessException">Denotes that you tried to update a record that does not belong to the user's company.</exception>
        /// <returns>The updated cash receipt model.</returns>
        public async Task<CashReceiptModel> SaveCashReceipt(PortalUser currentUser, CashReceiptModel cashReceipt)
        {
            var existingCashReceipt = await repository.GetCashReceiptById(cashReceipt.CashReceiptId);

            if (existingCashReceipt == null & cashReceipt.CashReceiptId > 0)
                throw new NullReferenceException("The cash receipt does not exist.");
            else if (existingCashReceipt == null)
            {
                existingCashReceipt = new CashReceipt()
                {
                    CreatedBy = currentUser.PortalUsername,
                    CreatedDate = DateTime.UtcNow,
                    ModifiedBy = currentUser.PortalUsername,
                    ModifiedDate = DateTime.UtcNow
                };
            }
            else if (existingCashReceipt.CompanyId != currentUser.CompanyId)
                throw new UnauthorizedAccessException("You cannot access this cash receipt as this user.");

            existingCashReceipt.CenterId = cashReceipt.Terminal;
            existingCashReceipt.PaymentDate = cashReceipt.PaymentDate;
            existingCashReceipt.PaymentNumber = cashReceipt.PaymentNumber;
            existingCashReceipt.DispatchLoadNumber = cashReceipt.DispatchLoadNumber;
            existingCashReceipt.DriverFuelSurcharge = cashReceipt.DriverFuelSurcharge;
            existingCashReceipt.DriverRate = cashReceipt.DriverRate;
            existingCashReceipt.CompanyId = currentUser.CompanyId;
            existingCashReceipt.IsActive = true;
            existingCashReceipt.ManufacturerFuelSurcharge = cashReceipt.ManufacturerFuelSurcharge;
            existingCashReceipt.ManufacturerId = cashReceipt.VendorId;
            existingCashReceipt.ManufacturerRate = cashReceipt.ManufacturerRate;
            existingCashReceipt.VIN = cashReceipt.TrackingIdNumber;
            existingCashReceipt.TransactionStatusTypeId = (int)TransactionStatusType.Enum.Open;

            if (cashReceipt.Driver != null)
            {

                var driver = cashReceipt.Driver != null ? await repository.GetDriverById(cashReceipt.Driver.DriverId) : null;

                if (driver != null)
                {
                    existingCashReceipt.DriverId = driver.DriverId;
                }
                else
                    throw new NullReferenceException("Driver was not found.");
            }

            var truck = await repository.GetTruckByTruckNumber(cashReceipt.TruckNumber);

            if (truck != null)
            {
                existingCashReceipt.TruckId = truck.TruckId;
            }

            if (cashReceipt.CashReceiptId == 0)
            {
                repository.Insert(existingCashReceipt);
                await repository.SaveChanges();
                await CreateCashReceiptRevision(currentUser, existingCashReceipt.CashReceiptId, "Created");
            }
            else
            {
                existingCashReceipt.ModifiedBy = currentUser.PortalUsername;
                existingCashReceipt.ModifiedDate = DateTime.UtcNow;

                repository.Attach(existingCashReceipt);
                await repository.SaveChanges();
                await CreateCashReceiptRevision(currentUser, existingCashReceipt.CashReceiptId, "Updated");
            }

            return LoadCashReceipt(existingCashReceipt);
        }

        /// <summary>
        /// This will create a revision of the current CashReceipt with the note given.
        /// </summary>
        /// <param name="currentUser">The user that is creating the revision.</param>
        /// <param name="note">The note that will be placed with the revision.</param>
        /// <returns></returns>
        public async Task CreateCashReceiptRevision(PortalUser currentUser, int cashReceiptId, string note)
        {
            CashReceipt currData = await repository.GetCashReceiptById(cashReceiptId);

            if (currData == null)
                throw new NullReferenceException("Could not find the cash receipt by id.");

            CashReceiptRev cashReceiptRevision = new CashReceiptRev()
            {
                CashReceiptId = currData.CashReceiptId,
                CenterId = currData.CenterId,
                CompanyId = currData.CompanyId,
                DispatchLoadNumber = currData.DispatchLoadNumber,
                DriverFuelSurcharge = currData.DriverFuelSurcharge,
                DriverId = currData.DriverId,
                DriverRate = currData.DriverRate,
                IsActive = currData.IsActive,
                ManufacturerFuelSurcharge = currData.ManufacturerFuelSurcharge,
                ManufacturerId = currData.ManufacturerId,
                ManufacturerRate = currData.ManufacturerRate,
                PaymentDate = currData.PaymentDate,
                PaymentNumber = currData.PaymentNumber,
                TransactionStatusTypeId = currData.TransactionStatusTypeId,
                TruckId = currData.TruckId,
                VIN = currData.VIN,
                Note = note
            };

            List<CashReceiptRev> currentRevisions = await repository.GetCashReceiptRevListByCashReceiptId(cashReceiptId);

            cashReceiptRevision.Version = currentRevisions.Count > 0 ? currentRevisions.Max(x => x.Version) + 1 : 1;
            cashReceiptRevision.RevisedBy = currentUser.PortalUsername;
            cashReceiptRevision.RevisionDate = DateTime.UtcNow;

            repository.Insert(cashReceiptRevision);
            await repository.SaveChanges();
        }

        /// <summary>
        /// Starts the process of reconciling a cash receipt.
        /// </summary>
        /// <param name="currentUser">The user that started the process.</param>
        /// <param name="cashReceipt">The cash receipt being reconciled.</param>
        /// <returns></returns>
        public async Task ReconcileCashReceipt(PortalUser currentUser, CashReceiptModel cashReceipt)
        {
            CashReceipt dbCashReceipt = await repository.GetCashReceiptById(cashReceipt.CashReceiptId);
            dbCashReceipt.TransactionStatusTypeId = (int)TransactionStatusType.Enum.Reconciled;
            dbCashReceipt.ModifiedBy = currentUser.PortalUsername;
            dbCashReceipt.ModifiedDate = DateTime.UtcNow;

            await repository.SaveChanges();

            await CreateCashReceiptRevision(currentUser, cashReceipt.CashReceiptId, "Reconciled");
        }

        /// <summary>
        /// Deletes a cash receipt and moves all the revisions into the history table.
        /// </summary>
        /// <param name="currentUser">The user deletingthe cash receipt.</param>
        /// <param name="cashReceiptId">the id of the cash receipt being deleted.</param>
        /// /// <exception cref="NullReferenceException">This gets thrown when the invoiceId is not found in the database.</exception>
        /// <returns></returns>
        public async Task DeleteCashReceipt(PortalUser currentUser, int cashReceiptId)
        {
            // First we get the cash receipt.
            CashReceipt cashReceipt = await repository.GetCashReceiptById(cashReceiptId);

            if (cashReceipt == null)
                throw new NullReferenceException("The cash receipt could not be found.");

            cashReceipt.TransactionStatusTypeId = (int)TransactionStatusType.Enum.Void;

            await repository.SaveChanges();

            // Second we go and create a revision for deleting.
            await CreateCashReceiptRevision(currentUser, cashReceiptId, "Deleted");

            // Then we move all of the revisions into the history table and delete them.
            var revisions = await repository.GetCashReceiptRevListByCashReceiptId(cashReceiptId);

            foreach(CashReceiptRev cashReceiptRev in revisions)
            {
                CashReceiptHist newHistory = new CashReceiptHist()
                {
                    CenterId = cashReceiptRev.CenterId,
                    CompanyId = cashReceiptRev.CompanyId,
                    PaymentNumber = cashReceiptRev.PaymentNumber,
                    PaymentDate = cashReceipt.PaymentDate,
                    DispatchLoadNumber = cashReceiptRev.DispatchLoadNumber,
                    DriverFuelSurcharge = cashReceiptRev.DriverFuelSurcharge,
                    DriverId = cashReceiptRev.DriverId,
                    DriverRate = cashReceiptRev.DriverRate,
                    CashReceiptHistId = 0,
                    CashReceiptId = cashReceiptRev.CashReceiptId,
                    IsActive = cashReceiptRev.IsActive,
                    ManufacturerFuelSurcharge = cashReceiptRev.ManufacturerFuelSurcharge,
                    ManufacturerId = cashReceiptRev.ManufacturerId,
                    ManufacturerRate = cashReceiptRev.ManufacturerRate,
                    Note = cashReceiptRev.Note,
                    RevisedBy = cashReceiptRev.RevisedBy,
                    RevisionDate = cashReceiptRev.RevisionDate,
                    TransactionStatusTypeId = (int)TransactionStatusType.Enum.Void,
                    TruckId = cashReceiptRev.TruckId,
                    Version = cashReceiptRev.Version,
                    VIN = cashReceiptRev.VIN
                };

                repository.Insert(newHistory);
                repository.Delete(cashReceiptRev);
            }

            repository.Delete(cashReceipt);
            await repository.SaveChanges();
        }

        /// <summary>
        /// This method will convert from the database model of cash receipt to the DTO verison.
        /// </summary>
        /// <param name="cashReceipt">The database model of cash receipt.</param>
        /// <returns>The DTO of cash receipt.</returns>
        public CashReceiptModel LoadCashReceipt(CashReceipt cashReceipt)
        {
            CashReceiptModel resp = new CashReceiptModel()
            {
                PaymentDate = cashReceipt.PaymentDate,
                PaymentNumber = cashReceipt.PaymentNumber,
                DispatchLoadNumber = cashReceipt.DispatchLoadNumber,
                Driver = null,
                DriverFuelSurcharge = cashReceipt.DriverFuelSurcharge,
                DriverRate = cashReceipt.DriverRate,
                CashReceiptId = cashReceipt.CashReceiptId,
                ManufacturerFuelSurcharge = cashReceipt.ManufacturerFuelSurcharge,
                ManufacturerRate = cashReceipt.ManufacturerRate,
                Terminal = cashReceipt.CenterId,
                TrackingIdNumber = cashReceipt.VIN,
                VendorId = cashReceipt.ManufacturerId,
                IsReconciled = false,
                IsDeleted = false
            };

            //if (cashReceipt.Driver != null)
            //{
            //    resp.Driver = new DriverModel()
            //    {
            //        DriverId = cashReceipt.Driver.DriverId,
            //        DriverFirstName = cashReceipt.Driver.FirstName,
            //        DriverLastName = cashReceipt.Driver.LastName,
            //        DriverFullName = $"{cashReceipt.Driver.FirstName} {cashReceipt.Driver.LastName}"
            //    };
            //}

            if (cashReceipt.Truck != null)
            {
                resp.TruckId = cashReceipt.Truck.TruckId;
                resp.TruckNumber = cashReceipt.Truck.TruckNumber;
            }

            return resp;
        }
    }
}
