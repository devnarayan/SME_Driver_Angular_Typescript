using Microsoft.EntityFrameworkCore;

namespace SME.TMS.API.Models
{
    public class SMEDispatchDEVContext : DbContext
    {
        public SMEDispatchDEVContext(DbContextOptions<SMEDispatchDEVContext> options) : base(options)
        { }

        public SMEDispatchDEVContext() { }

        //public DbSet<PortalUser> PortalUser { get; set; }
        
        public virtual DbSet<CashReceipt> CashReceipt { get; set; }
        public virtual DbSet<CashReceiptHist> CashReceiptHist { get; set; }
        public virtual DbSet<CashReceiptRev> CashReceiptRev { get; set; }
        public virtual DbSet<Company> Company { get; set; }
        public virtual DbSet<Contract> Contract { get; set; }
        public virtual DbSet<ContractFinanceAgreement> ContractFinanceAgreement { get; set; }
        public virtual DbSet<ContractTruck> ContractTruck { get; set; }
        public virtual DbSet<Driver> Driver { get; set; }
        public virtual DbSet<DriverContract> DriverContract { get; set; }
        public virtual DbSet<DriverEmail> DriverEmail { get; set; }
        public virtual DbSet<DriverInsurance> DriverInsurance { get; set; }
        public virtual DbSet<DriverMedicalHistory> DriverMedicalHistory { get; set; }
        public virtual DbSet<DriverPhone> DriverPhone { get; set; }
        public virtual DbSet<EthnicityType> EthnicityType { get; set; }
        public virtual DbSet<ExpenseType> ExpenseType { get; set; }
        public virtual DbSet<FinanceAgreement> FinanceAgreement { get; set; }
        public virtual DbSet<FinanceType> FinanceType { get; set; }
        public virtual DbSet<FrequencyType> FrequencyType { get; set; }
        public virtual DbSet<GenderType> GenderType { get; set; }
        public virtual DbSet<GLAccount> GLAccount { get; set; }
        public virtual DbSet<GLAccountType> GLAccountType { get; set; }
        public virtual DbSet<InsuranceProvider> InsuranceProvider { get; set; }
        public virtual DbSet<Invoice> Invoice { get; set; }
        public virtual DbSet<InvoiceHist> InvoiceHist { get; set; }
        public virtual DbSet<InvoiceRev> InvoiceRev { get; set; }
        public virtual DbSet<JournalEntry> JournalEntry { get; set; }
        public virtual DbSet<JournalRecurringExtension> JournalRecurringExtension { get; set; }
        public virtual DbSet<JournalMaintenanceExtension> JournalMaintenanceExtension { get; set; }
        public virtual DbSet<JournalType> JournalType { get; set; }
        public virtual DbSet<JournalImport> JournalImport { get; set; }
        public virtual DbSet<MaintenanceType> MaintenanceType { get; set; }
        public virtual DbSet<MedicalProvider> MedicalProvider { get; set; }
        public virtual DbSet<Period> Period { get; set; }
        public virtual DbSet<PhoneNumberType> PhoneNumberType { get; set; }
        public virtual DbSet<PortalUser> PortalUser { get; set; }
        public virtual DbSet<PortalUserDealer> PortalUserDealer { get; set; }
        public virtual DbSet<PortalUserManufacturer> PortalUserManufacturer { get; set; }
        public virtual DbSet<PortalUserType> PortalUserType { get; set; }
        public virtual DbSet<StateProvince> StateProvince { get; set; }
        public virtual DbSet<Truck> Truck { get; set; }
        public virtual DbSet<Manufacturer> Manufacturer { get; set; }
        public virtual DbSet<Expense> Expense { get; set; }
        public virtual DbSet<MessageLog> MessageLog { get; set; }
        public virtual DbSet<TemplateDefinition> TemplateDefinition { get; set; }
        public virtual DbSet<ImportedExpense> ImportedExpense { get; set; }

    }
}
