using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using SME.TMS.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace SME.TMS.API.Repo
{
    public class DriverRepository : IDriverRepository
    {
        private readonly SMEDispatchDEVContext _context;

        public DriverRepository(SMEDispatchDEVContext context)
        {
            _context = context;
        }


        #region Context Functions
        public void Insert(object entity)
        {
            _context.Entry(entity).State = EntityState.Added;
        }

        public void Ignore(object entity)
        {
            _context.Entry(entity).State = EntityState.Detached;
        }

        public Task<int> SaveChanges()
        {
            return _context.SaveChangesAsync();
        }

        public void SetTimeout(int timeout)
        {
            _context.Database.SetCommandTimeout(timeout);
        }

        public void Attach(object entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
        }

        public bool IsChanged(object entity)
        {
            return _context.Entry(entity).State != EntityState.Detached
                && _context.Entry(entity).State != EntityState.Unchanged;
        }

        public int GetEntityState(object entity)
        {
            return (int)_context.Entry(entity).State;
        }

        public void Delete(object entity)
        {
            _context.Entry(entity).State = EntityState.Deleted;
        }

        public async Task<IDbContextTransaction> StartTransaction()
        {
            return await _context.Database.BeginTransactionAsync();
        }

        #endregion

        #region Get All Functions

        public async Task<List<GenderType>> GetAllGenderTypes()
        {
            return await _context.GenderType.ToListAsync();
        }

        public async Task<List<PhoneNumberType>> GetAllPhoneNumberTypes()
        {
            return await _context.PhoneNumberType.ToListAsync();
        }

        public async Task<List<InsuranceProvider>> GetAllInsuranceProviders()
        {
            return await _context.InsuranceProvider.ToListAsync();
        }

        public async Task<List<MedicalProvider>> GetAllMedicalProviders()
        {
            return await _context.MedicalProvider.ToListAsync();
        }

        public async Task<List<EthnicityType>> GetAllEthnicityTypes()
        {
            return await _context.EthnicityType.ToListAsync();
        }

        public async Task<List<StateProvince>> GetAllStateProvinces()
        {
            return await _context.StateProvince.ToListAsync();
        }

        public async Task<List<FinanceType>> GetAllFinanceTypes()
        {
            return await _context.FinanceType.ToListAsync();
        }

        public async Task<List<MaintenanceType>> GetAllMaintenanceTypes()
        {
            return await _context.MaintenanceType.ToListAsync();
        }

        public async Task<List<JournalType>> GetAllJournalTypes()
        {
            return await _context.JournalType.ToListAsync();
        }

        public async Task<List<Manufacturer>> GetAllManufacturers()
        {
            return await _context.Manufacturer.ToListAsync();
        }

        public async Task<List<FrequencyType>> GetAllFrequencyTypes()
        {
            return await _context.FrequencyType.ToListAsync();
        }

        public async Task<List<ExpenseType>> GetAllExpenseTypes()
            => await _context.ExpenseType.Include(x => x.FrequencyType).ToListAsync();

        public async Task<List<GLAccount>> GetAllGLAccounts()
            => await _context.GLAccount.ToListAsync();

        #endregion

        #region Specific Functions

        // Generic method to get a contract.
        public async Task<Contract> GetContractById(int id)
        {
            return await _context.Contract.SingleOrDefaultAsync(x => x.ContractId == id);
        }

        public async Task<Driver> GetDriverById(int id)
        {
            return await _context.Driver.SingleOrDefaultAsync(x => x.DriverId == id);
        }

        public async Task<StateProvince> GetStateProvinceById(int id)
        {
            return await _context.StateProvince.SingleOrDefaultAsync(s => s.StateProvinceId == id);
        }

        public async Task<GenderType> GetGenderTypeById(int id)
        {
            return await _context.GenderType.SingleOrDefaultAsync(g => g.GenderTypeId == id);
        }

        public async Task<DriverPhone> GetDriverPhoneById(int id)
        {
            return await _context.DriverPhone.SingleOrDefaultAsync(p => p.DriverPhoneId == id);
        }

        public async Task<PhoneNumberType> GetPhoneNumberTypeById(int id)
        {
            return await _context.PhoneNumberType.SingleOrDefaultAsync(p => p.PhoneNumberTypeId == id);
        }

        public async Task<DriverEmail> GetDriverEmailById(int id)
        {
            return await _context.DriverEmail.SingleOrDefaultAsync(e => e.DriverEmailId == id);
        }

        public async Task<DriverMedicalHistory> GetDriverMedicalHistoryById(int id)
        {
            return await _context.DriverMedicalHistory.SingleOrDefaultAsync(m => m.DriverMedicalHistoryId == id);
        }

        public async Task<DriverInsurance> GetDriverInsuranceById(int id)
        {
            return await _context.DriverInsurance.SingleOrDefaultAsync(i => i.DriverInsuranceId == id);
        }

        public async Task<PortalUser> GetPortalUserById(int id)
        {
            return await _context.PortalUser.Include(x => x.ReferencingCompany).SingleOrDefaultAsync(u => u.PortalUserId == id);
        }

        public async Task<PortalUser> GetPortalUserByUsername(string username)
        {
            return await _context.PortalUser.Include(x => x.ReferencingCompany).SingleOrDefaultAsync(u => u.PortalUsername == username);
        }

        public async Task<Invoice> GetInvoiceById(int id)
        {
            return await _context.Invoice.Include(x => x.Driver).SingleOrDefaultAsync(x => x.InvoiceId == id);
        }

        public async Task<List<Invoice>> GetInvoicesByManufacturerId(int id, int companyId)
        {
            return await _context.Invoice.Where(x => x.ManufacturerId == id && x.CompanyId == companyId).Include(x => x.Driver).ToListAsync();
        }

        public async Task<CashReceipt> GetCashReceiptById(int id)
        {
            return await _context.CashReceipt.SingleOrDefaultAsync(x => x.CashReceiptId == id);
        }

        public async Task<List<CashReceipt>> GetCashReceiptByManufacturerId(int id, int companyId)
        {
            return await _context.CashReceipt.Where(x => x.ManufacturerId == id && x.CompanyId == companyId).ToListAsync();
        }

        public async Task<EthnicityType> GetEthnicityTypeById(int id)
        {
            return await _context.EthnicityType.SingleOrDefaultAsync(x => x.EthnicityTypeId == id);
        }

        public async Task<PortalUser> AuthenticateUser(string username, string password)
        {
            PortalUser portalUser = await GetPortalUserByUsername(username);

            //THIS IS THE STANDARD DEALER MANUFACTURER PORTALUSER PATH
            // Create Hashing object to has the attempted password and a 32-bit salt.
            Rfc2898DeriveBytes pbkdf2 = new Rfc2898DeriveBytes(password, 32);
            pbkdf2.IterationCount = 1000;

            //Set the salt.
            pbkdf2.Salt = Convert.FromBase64String(portalUser.Salt);
            // Hash Password
            byte[] hash = pbkdf2.GetBytes(32);
            string base64Hash = Convert.ToBase64String(hash);
            // Compare.
            return await _context.PortalUser.Include(x => x.ReferencingCompany).FirstOrDefaultAsync(x => x.PortalUsername == username && x.PortalPassword == base64Hash);
        }

        public async Task<PortalUser> AuthenticateUserToken(int userId, string userToken)
        {
            PortalUser portalUser = await GetPortalUserById(userId);

#warning TODO: Add token support. Currently returns user.

            return portalUser;
        }

        public async Task<FinanceType> GetFinanceTypeByName(string name)
        {
            return await _context.FinanceType.SingleOrDefaultAsync(x => x.FinanceTypeName == name);
        }

        public async Task<List<Driver>> GetDriversByCompanyId(int id)
        {
            return await _context.Driver.Where(x => x.CompanyId == id).ToListAsync();
        }

        public async Task<List<DriverContract>> GetDriverContractsByDriverId(int id)
        {
            return await _context.DriverContract.Where(x => x.DriverId == id).Include(x => x.Contract).ToListAsync();
        }

        public async Task<List<DriverEmail>> GetDriverEmailsByDriverId(int id)
        {
            return await _context.DriverEmail.Where(x => x.DriverId == id).ToListAsync();
        }

        public async Task<List<DriverMedicalHistory>> GetDriverMedicalHistoryByDriverId(int id)
        {
            return await _context.DriverMedicalHistory.Where(x => x.DriverId == id).Include(x => x.MedicalProvider).ToListAsync();
        }

        public async Task<List<DriverPhone>> GetDriverPhonesByDriverId(int id)
        {
            return await _context.DriverPhone.Where(x => x.DriverId == id).Include(x => x.PhoneNumberType).ToListAsync();
        }

        public async Task<List<DriverInsurance>> GetDriverInsuranceByDriverId(int id)
        {
            return await _context.DriverInsurance.Where(x => x.DriverId == id).Include(x => x.InsuranceProvider).ToListAsync();
        }

        public async Task<List<CashReceipt>> GetCashReceiptsByCompanyId(int id)
        {
            return await _context.CashReceipt.Include(x => x.Truck).Include(x => x.Driver).Where(x => x.CompanyId == id).ToListAsync();
        }

        public async Task<List<Truck>> GetTrucksByCompanyId(int id)
        {
            return await _context.Truck.Where(x => x.CompanyId == id).ToListAsync();
        }

        public async Task<List<Contract>> GetContractsByCompanyId(int id)
        {
            return await _context.Contract.Where(x => x.CompanyId == id).ToListAsync();
        }

        public async Task<List<DriverContract>> GetDriverContractsByContractId(int id)
        {
            return await _context.DriverContract.Where(x => x.ContractId == id).Include(x => x.Driver).ToListAsync();
        }

        public async Task<List<ContractTruck>> GetContractTrucksByContractId(int id)
        {
            return await _context.ContractTruck.Where(x => x.ContractId == id).Include(x => x.Truck).ToListAsync();
        }

        public async Task<List<ContractFinanceAgreement>> GetContractFinanceAgreementsByContractId(int id)
        {
            return await _context.ContractFinanceAgreement.Where(x => x.ContractId == id).Include(x => x.FinanceType).ToListAsync();
        }

        public async Task<DriverContract> GetDriverContractById(int id)
        {
            return await _context.DriverContract.SingleOrDefaultAsync(x => x.DriverContractId == id);
        }

        public async Task<ContractTruck> GetContractTruckById(int id)
        {
            return await _context.ContractTruck.SingleOrDefaultAsync(x => x.ContractTruckId == id);
        }

        public async Task<ContractFinanceAgreement> GetContractFinanceAgreementById(int id)
        {
            return await _context.ContractFinanceAgreement.SingleOrDefaultAsync(x => x.ContractFinanceAgreementId == id);
        }

        public async Task<Truck> GetTruckByTruckNumber(string truckNumber)
        {
            return await _context.Truck.SingleOrDefaultAsync(x => x.TruckNumber == truckNumber);
        }

        public async Task<List<Invoice>> GetInvoicesByCompanyId(int id)
        {
            return await _context.Invoice.Include(x => x.Truck).Include(x => x.Driver).Where(x => x.CompanyId == id).ToListAsync();
        }

        public async Task<List<InvoiceRev>> GetInvoiceRevListByInvoiceId(int id)
        {
            return await _context.InvoiceRev.Where(x => x.InvoiceId == id).ToListAsync();
        }

        public async Task<List<CashReceiptRev>> GetCashReceiptRevListByCashReceiptId(int id)
        {
            return await _context.CashReceiptRev.Where(x => x.CashReceiptId == id).ToListAsync();
        }

        public async Task<FrequencyType> GetFrequencyTypeById(int id)
        {
            return await _context.FrequencyType.SingleOrDefaultAsync(x => x.FrequencyTypeId == id);
        }

        public async Task<List<JournalEntry>> GetMaintenanceJournalEntriesByDriverId(int id)
        {
            return await _context.JournalEntry.Include(x => x.MaintenanceExtension).ThenInclude(x => x.MaintenanceType)
                                              .Include(x => x.JournalType)
                                              .Where(x => x.DriverId == id && x.JournalTypeId == (int)JournalType.Enum.MaintenanceParts).ToListAsync();
        }

        public async Task<List<JournalEntry>> GetRecurringJournalEntriesByDriverId(int id)
        {
            return await _context.JournalEntry.Include(x => x.RecurringExtension).ThenInclude(x => x.FrequencyType)
                                              .Include(x => x.JournalType)
                                              .Where(x => x.DriverId == id && x.JournalTypeId == (int)JournalType.Enum.Recurring).ToListAsync();
        }

        public async Task<List<JournalEntry>> GetRecurringJournalEntriesByContractId(int id)
        {
            return await _context.JournalEntry.Include(x => x.Driver)
                                              .Include(x => x.RecurringExtension).ThenInclude(x => x.FrequencyType)
                                              .Include(x => x.JournalType)
                                              .Where(x => x.ContractId == id && x.JournalTypeId == (int)JournalType.Enum.Recurring).ToListAsync();
        }

        public async Task<JournalEntry> GetJournalEntryById(int id)
        {
            return await _context.JournalEntry.SingleOrDefaultAsync(x => x.JournalEntryId == id);
        }

        public async Task<decimal> GetInvoiceAcknowledgedProgressPercent()
        {
            return ((decimal)(await _context.Invoice.Where(x => x.TransactionStatusTypeId == (int)TransactionStatusType.Enum.Acknowledge).CountAsync())
                / (decimal)(await _context.Invoice.CountAsync())) * 100.0m;
        }

        public async Task<decimal> GetCashReceiptReconciledProgressPercent()
        {
            return ((decimal)(await _context.CashReceipt.Where(x => x.TransactionStatusTypeId == (int)TransactionStatusType.Enum.Reconciled).CountAsync())
                / (decimal)(await _context.CashReceipt.CountAsync())) * 100.0m;
        }

        public async Task<JournalEntry> GetRecurringJournalEntryById(int id)
        {
            return await _context.JournalEntry.Include(x => x.JournalType)
                                              .Include(x => x.RecurringExtension).ThenInclude(x => x.FrequencyType)
                                              .SingleOrDefaultAsync(x => x.JournalEntryId == id && x.JournalTypeId == (int)JournalType.Enum.Recurring);
        }

        public async Task<JournalEntry> GetMaintenanceJournalEntryById(int id)
        {
            return await _context.JournalEntry.Include(x => x.JournalType)
                                              .Include(x => x.MaintenanceExtension).ThenInclude(x => x.MaintenanceType)
                                              .SingleOrDefaultAsync(x => x.JournalEntryId == id && x.JournalTypeId == (int)JournalType.Enum.MaintenanceParts);
        }

        public async Task<MaintenanceType> GetMaintenanceById(int id)
        {
            return await _context.MaintenanceType.SingleOrDefaultAsync(x => x.MaintenanceTypeId == id);
        }

        public async Task<JournalType> GetJournalTypeById(int id)
        {
            return await _context.JournalType.SingleOrDefaultAsync(x => x.JournalTypeId == id);
        }

        public async Task<List<JournalImport>> GetJournalImportListById(int journalEntryId)
        {
            return await _context.JournalImport
                 .Where(x => x.JournalEntryID== journalEntryId).ToListAsync();
        }
        public async Task<JournalImport> GetJournalImportById(Guid journalImportId)
        {
            return await _context.JournalImport
                 .Where(x => x.JournalImportId == journalImportId).FirstOrDefaultAsync();
        }

        public bool DeleteJournalImportById(Guid journalImportId)
        {
            var importData = _context.JournalImport.Where(st => st.JournalImportId == journalImportId).FirstOrDefault();
            if (importData != null)
            {
                _context.JournalImport.Remove(importData);
                _context.SaveChanges();
                return true;
            }
            return false;
        }


        public async Task<Period> GetPeriodById(int id)
            => await _context.Period.SingleOrDefaultAsync(x => x.PeriodId == id);

        public async Task<List<Period>> GetPeriodsByCompanyId(int id)
            => await _context.Period.Include(x => x.FrequencyType).Where(x => x.CompanyId == id).ToListAsync();

        public async Task<bool> IsPeriodOverlapping(DateTime startDate, DateTime endDate)
            => await _context.Period.Include(x => x.FrequencyType)
                .Where(x => (x.StartDate <= startDate && x.EndDate >= startDate) || (x.StartDate <= endDate && x.EndDate >= endDate)).AnyAsync();

        public async Task<ExpenseType> GetExpenceTypeById(int id)
            => await _context.ExpenseType.Include(x => x.FrequencyType).SingleOrDefaultAsync(x => x.ExpenseTypeID == id);

        public async Task<List<ExpenseType>> GetExpenseTypeByCompanyIdAsync(int id)
            => await _context.ExpenseType.Where(x => true).ToListAsync();

        public async Task<List<Invoice>> GetInvoicesByDriverId(int id)
            => await _context.Invoice.Where(x => x.DriverId == id).ToListAsync();

        #endregion
    }
}
