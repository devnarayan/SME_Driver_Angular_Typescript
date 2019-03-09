using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Interface
{
    public class JournalEntryModel
    {
        public int JournalEntryId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string DriverGLAccount { get; set; }
        public string SMEGLAccount { get; set; }
        public DriverModel Driver { get; set; }
        public List<SettledTransactionModel> SettledTransactions { get; set; }
        public ContractModel Contract { get; set; }
    }

    public class JournalFileModel
    {
        public JournalImportModel docfile { get; set; }
    }

    public class JournalImportModel
    {
        public System.Guid JournalImportId { get; set; }
        public int JournalEntryID { get; set; }
        public string DocTitle { get; set; }
        public string ContentType { get; set; }
        public byte[] FileData { get; set; }
        public string FileData64String { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string FileName { get; set; }
    }

    public class TemplateDefinitionModel
    {
        public int TemplateDefinitionId { get; set; }
        public string TemplateDefinitionName { get; set; }
        public string TemplateDefinitionDesc { get; set; }
        public string TemplateDefinitionSchema { get; set; }
        public Nullable<int> VendorId { get; set; }
        public Nullable<int> OpenCount { get; set; }
    }
    public class ImportedExpenseModel
    {
        public int ImportedExpenseId { get; set; }
        public Nullable<int> TemplateDefinitionId { get; set; }
        public Nullable<int> DriverId { get; set; }
        public Nullable<int> ContractId { get; set; }
        public Nullable<int> TruckId { get; set; }
        public Nullable<System.DateTime> TransactionDate { get; set; }
        public string TransactionDesc { get; set; }
        public string TransactionNumber { get; set; }
        public Nullable<decimal> DriverAmount { get; set; }
        public Nullable<decimal> SMEAmount { get; set; }
        public bool IsOpen { get; set; }
        public System.DateTime ImportDate { get; set; }
        public string ImportByUser { get; set; }

    }
    public class DriverTruckModel
    {
        public int ContractId { get; set; }
        public int TruckId { get; set; }
        public int DriverId { get; set; }
        public string DriverName { get; set; }
        public string TruckNumber { get; set; }
        public string ContractName { get; set; }
    }
}
