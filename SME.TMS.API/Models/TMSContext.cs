using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace SME.TMS.API.Models
{
    public partial class TMSContext : DbContext
    {
//        public virtual DbSet<Contract> Contract { get; set; }
//        public virtual DbSet<Driver> Driver { get; set; }
//        public virtual DbSet<DriverContract> DriverContract { get; set; }
//        public virtual DbSet<DriverEmail> DriverEmail { get; set; }
//        public virtual DbSet<DriverInsurance> DriverInsurance { get; set; }
//        public virtual DbSet<DriverMedicalHistory> DriverMedicalHistory { get; set; }
//        public virtual DbSet<DriverPhone> DriverPhone { get; set; }
//        public virtual DbSet<GenderType> GenderType { get; set; }
//        public virtual DbSet<InsuranceProvider> InsuranceProvider { get; set; }
//        public virtual DbSet<MedicalProvider> MedicalProvider { get; set; }
//        public virtual DbSet<PhoneNumberType> PhoneNumberType { get; set; }
//        public virtual DbSet<PortalUser> PortalUser { get; set; }
//        public virtual DbSet<PortalUserDealer> PortalUserDealer { get; set; }
//        public virtual DbSet<PortalUserManufacturer> PortalUserManufacturer { get; set; }
//        public virtual DbSet<PortalUserType> PortalUserType { get; set; }
//        public virtual DbSet<StateProvince> StateProvince { get; set; }

//        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//        {
//            if (!optionsBuilder.IsConfigured)
//            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
//                optionsBuilder.UseSqlServer(@"Server = 192.168.0.55; Database = TMS; Trusted_Connection = False; User Id = sa; Password = !QAZ2wsx;");
//            }
//        }

//        protected override void OnModelCreating(ModelBuilder modelBuilder)
//        {
//            modelBuilder.Entity<Contract>(entity =>
//            {
//                entity.Property(e => e.ContractEndDate).HasColumnType("datetime");

//                entity.Property(e => e.ContractName)
//                    .IsRequired()
//                    .HasMaxLength(150)
//                    .IsUnicode(false);

//                entity.Property(e => e.ContractNumber)
//                    .IsRequired()
//                    .HasMaxLength(50)
//                    .IsUnicode(false);

//                entity.Property(e => e.ContractStartDate).HasColumnType("datetime");

//                entity.Property(e => e.CreatedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

//                entity.Property(e => e.ModifiedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
//            });

//            modelBuilder.Entity<Driver>(entity =>
//            {
//                entity.Property(e => e.AccountingDriverId)
//                    .IsRequired()
//                    .HasColumnType("char(9)");

//                entity.Property(e => e.City)
//                    .HasMaxLength(50)
//                    .IsUnicode(false);

//                entity.Property(e => e.Company)
//                    .HasMaxLength(50)
//                    .IsUnicode(false);

//                entity.Property(e => e.ContractExp)
//                    .HasColumnName("Contract_Exp")
//                    .HasColumnType("datetime");

//                entity.Property(e => e.ContractTerm).HasColumnName("Contract_Term");

//                entity.Property(e => e.CreatedBy).HasMaxLength(50);

//                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

//                entity.Property(e => e.DashNotes)
//                    .HasColumnName("Dash_Notes")
//                    .HasColumnType("text");

//                entity.Property(e => e.DateOfBirth).HasColumnType("datetime");

//                entity.Property(e => e.Dcxsupplier).HasColumnName("DCXSupplier");

//                entity.Property(e => e.DcxsupplierId)
//                    .HasColumnName("DCXSupplierID")
//                    .HasColumnType("char(9)");

//                entity.Property(e => e.DriverLicenseExpiration).HasColumnType("datetime");

//                entity.Property(e => e.DriverLicenseNumber)
//                    .HasMaxLength(50)
//                    .IsUnicode(false);

//                entity.Property(e => e.FirstName)
//                    .HasMaxLength(35)
//                    .IsUnicode(false);

//                entity.Property(e => e.FirstName2)
//                    .HasMaxLength(35)
//                    .IsUnicode(false);

//                entity.Property(e => e.FlatRate).HasColumnType("money");

//                entity.Property(e => e.HireDate).HasColumnType("datetime");

//                entity.Property(e => e.IsCoDriver).HasDefaultValueSql("((0))");

//                entity.Property(e => e.LastName)
//                    .HasMaxLength(35)
//                    .IsUnicode(false);

//                entity.Property(e => e.LastName2)
//                    .HasMaxLength(35)
//                    .IsUnicode(false);

//                entity.Property(e => e.MailTo).HasColumnType("char(3)");

//                entity.Property(e => e.Mn)
//                    .HasColumnName("MN")
//                    .HasColumnType("char(2)");

//                entity.Property(e => e.Mn2)
//                    .HasColumnName("MN2")
//                    .HasColumnType("char(2)");

//                entity.Property(e => e.ModifiedBy).HasMaxLength(50);

//                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

//                entity.Property(e => e.NewPayDisplayNotes)
//                    .HasMaxLength(255)
//                    .IsUnicode(false);

//                entity.Property(e => e.PayrollId).HasColumnType("char(10)");

//                entity.Property(e => e.PhoneNumber)
//                    .HasMaxLength(35)
//                    .IsUnicode(false);

//                entity.Property(e => e.Ssn)
//                    .HasColumnName("SSN")
//                    .HasColumnType("char(15)");

//                entity.Property(e => e.StateProvinceAbbrev).HasColumnType("char(2)");

//                entity.Property(e => e.StreetAddressLine1)
//                    .HasMaxLength(150)
//                    .IsUnicode(false);

//                entity.Property(e => e.StreetAddressLine2)
//                    .HasMaxLength(150)
//                    .IsUnicode(false);

//                entity.Property(e => e.TermDate).HasColumnType("datetime");

//                entity.Property(e => e.Terminal).HasColumnType("char(5)");

//                entity.Property(e => e.TransferredFrom).HasColumnType("char(9)");

//                entity.Property(e => e.TruckValue).HasColumnType("money");

//                entity.Property(e => e.WorkingDeposit).HasColumnType("money");

//                entity.Property(e => e.Zip).HasColumnType("char(10)");

//                entity.HasOne(d => d.GenderType)
//                    .WithMany(p => p.Driver)
//                    .HasForeignKey(d => d.GenderTypeId)
//                    .HasConstraintName("FK_Driver_GenderType");

//                entity.HasOne(d => d.StateProvince)
//                    .WithMany(p => p.Driver)
//                    .HasForeignKey(d => d.StateProvinceId)
//                    .HasConstraintName("FK_Driver_StateProvince");
//            });

//            modelBuilder.Entity<DriverContract>(entity =>
//            {
//                entity.Property(e => e.DriverContractId).HasColumnName("DriverContractID");

//                entity.Property(e => e.CreatedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

//                entity.Property(e => e.ModifiedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

//                entity.HasOne(d => d.Contract)
//                    .WithMany(p => p.DriverContract)
//                    .HasForeignKey(d => d.ContractId)
//                    .OnDelete(DeleteBehavior.ClientSetNull)
//                    .HasConstraintName("FK_DriverContract_Contract");

//                entity.HasOne(d => d.Driver)
//                    .WithMany(p => p.DriverContract)
//                    .HasForeignKey(d => d.DriverId)
//                    .OnDelete(DeleteBehavior.ClientSetNull)
//                    .HasConstraintName("FK_DriverContract_Driver");
//            });

//            modelBuilder.Entity<DriverEmail>(entity =>
//            {
//                entity.Property(e => e.CreatedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

//                entity.Property(e => e.DriverEmailAddress)
//                    .IsRequired()
//                    .HasMaxLength(150)
//                    .IsUnicode(false);

//                entity.Property(e => e.ModifiedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

//                entity.HasOne(d => d.Driver)
//                    .WithMany(p => p.DriverEmail)
//                    .HasForeignKey(d => d.DriverId)
//                    .OnDelete(DeleteBehavior.ClientSetNull)
//                    .HasConstraintName("FK_DriverEmail_Driver");
//            });

//            modelBuilder.Entity<DriverInsurance>(entity =>
//            {
//                entity.Property(e => e.CreatedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

//                entity.Property(e => e.InsuranceEffectiveDate).HasColumnType("datetime");

//                entity.Property(e => e.InsuranceEndDate).HasColumnType("datetime");

//                entity.Property(e => e.InsuranceRate).HasColumnType("decimal(18, 4)");

//                entity.Property(e => e.ModifiedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

//                entity.HasOne(d => d.Driver)
//                    .WithMany(p => p.DriverInsurance)
//                    .HasForeignKey(d => d.DriverId)
//                    .OnDelete(DeleteBehavior.ClientSetNull)
//                    .HasConstraintName("FK_DriverInsurance_Driver");

//                entity.HasOne(d => d.InsuranceProvider)
//                    .WithMany(p => p.DriverInsurance)
//                    .HasForeignKey(d => d.InsuranceProviderId)
//                    .OnDelete(DeleteBehavior.ClientSetNull)
//                    .HasConstraintName("FK_DriverInsurance_InsuranceProvider");
//            });

//            modelBuilder.Entity<DriverMedicalHistory>(entity =>
//            {
//                entity.Property(e => e.CreatedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

//                entity.Property(e => e.MedicalExamEffectiveDate).HasColumnType("datetime");

//                entity.Property(e => e.MedicalExamExpirationDate).HasColumnType("datetime");

//                entity.Property(e => e.MedicalExamRate).HasColumnType("decimal(18, 4)");

//                entity.Property(e => e.ModifiedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

//                entity.HasOne(d => d.Driver)
//                    .WithMany(p => p.DriverMedicalHistory)
//                    .HasForeignKey(d => d.DriverId)
//                    .OnDelete(DeleteBehavior.ClientSetNull)
//                    .HasConstraintName("FK_DriverMedicalHistory_Driver");

//                entity.HasOne(d => d.MedicalProvider)
//                    .WithMany(p => p.DriverMedicalHistory)
//                    .HasForeignKey(d => d.MedicalProviderId)
//                    .OnDelete(DeleteBehavior.ClientSetNull)
//                    .HasConstraintName("FK_DriverMedicalHistory_MedicalProvider");
//            });

//            modelBuilder.Entity<DriverPhone>(entity =>
//            {
//                entity.Property(e => e.CreatedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

//                entity.Property(e => e.DriverPhoneNumber)
//                    .IsRequired()
//                    .HasMaxLength(15);

//                entity.Property(e => e.ModifiedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

//                entity.HasOne(d => d.Driver)
//                    .WithMany(p => p.DriverPhone)
//                    .HasForeignKey(d => d.DriverId)
//                    .OnDelete(DeleteBehavior.ClientSetNull)
//                    .HasConstraintName("FK_DriverPhone_Driver");

//                entity.HasOne(d => d.PhoneNumberType)
//                    .WithMany(p => p.DriverPhone)
//                    .HasForeignKey(d => d.PhoneNumberTypeId)
//                    .OnDelete(DeleteBehavior.ClientSetNull)
//                    .HasConstraintName("FK_DriverPhone_PhoneNumberType");
//            });

//            modelBuilder.Entity<GenderType>(entity =>
//            {
//                entity.Property(e => e.CreatedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

//                entity.Property(e => e.GenderTypeAbbrev)
//                    .IsRequired()
//                    .HasMaxLength(10)
//                    .IsUnicode(false);

//                entity.Property(e => e.GenderTypeName)
//                    .IsRequired()
//                    .HasMaxLength(50)
//                    .IsUnicode(false);

//                entity.Property(e => e.ModifiedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
//            });

//            modelBuilder.Entity<InsuranceProvider>(entity =>
//            {
//                entity.Property(e => e.InsuranceProviderId).HasColumnName("InsuranceProviderID");

//                entity.Property(e => e.CreatedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

//                entity.Property(e => e.InsuranceProviderName)
//                    .IsRequired()
//                    .HasMaxLength(50)
//                    .IsUnicode(false);

//                entity.Property(e => e.ModifiedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
//            });

//            modelBuilder.Entity<MedicalProvider>(entity =>
//            {
//                entity.Property(e => e.MedicalProviderId).HasColumnName("MedicalProviderID");

//                entity.Property(e => e.CreatedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

//                entity.Property(e => e.MedicalProviderName)
//                    .IsRequired()
//                    .HasMaxLength(50)
//                    .IsUnicode(false);

//                entity.Property(e => e.ModifiedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
//            });

//            modelBuilder.Entity<PhoneNumberType>(entity =>
//            {
//                entity.Property(e => e.CreatedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

//                entity.Property(e => e.ModifiedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

//                entity.Property(e => e.PhoneNumberTypeName)
//                    .IsRequired()
//                    .HasMaxLength(50);
//            });

//            modelBuilder.Entity<PortalUser>(entity =>
//            {
//                entity.Property(e => e.PortalUserId)
//                    .HasColumnName("PortalUserID")
//                    .ValueGeneratedNever();

//                entity.Property(e => e.CompanyName)
//                    .IsRequired()
//                    .HasMaxLength(100)
//                    .IsUnicode(false);

//                entity.Property(e => e.DealerNumber)
//                    .HasMaxLength(10)
//                    .IsUnicode(false);

//                entity.Property(e => e.DefaultDealerId).HasColumnName("DefaultDealerID");

//                entity.Property(e => e.FullName)
//                    .IsRequired()
//                    .HasMaxLength(50)
//                    .IsUnicode(false);

//                entity.Property(e => e.LastLogin).HasColumnType("datetime");

//                entity.Property(e => e.ModifiedBy).HasMaxLength(50);

//                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

//                entity.Property(e => e.PasswordResetCode)
//                    .HasMaxLength(50)
//                    .IsUnicode(false);

//                entity.Property(e => e.PhoneNumber)
//                    .IsRequired()
//                    .HasMaxLength(50)
//                    .IsUnicode(false);

//                entity.Property(e => e.PortalPassword)
//                    .IsRequired()
//                    .IsUnicode(false);

//                entity.Property(e => e.PortalUserTypeId).HasColumnName("PortalUserTypeID");

//                entity.Property(e => e.PortalUsername)
//                    .IsRequired()
//                    .HasMaxLength(50)
//                    .IsUnicode(false);

//                entity.Property(e => e.Salt)
//                    .IsRequired()
//                    .IsUnicode(false);

//                entity.Property(e => e.UserProfileId).HasColumnName("UserProfileID");

//                entity.HasOne(d => d.PortalUserType)
//                    .WithMany(p => p.PortalUser)
//                    .HasForeignKey(d => d.PortalUserTypeId)
//                    .HasConstraintName("FK_PortalUser_PortalUserType");
//            });

//            modelBuilder.Entity<PortalUserDealer>(entity =>
//            {
//                entity.Property(e => e.PortalUserDealerId)
//                    .HasColumnName("PortalUserDealerID")
//                    .ValueGeneratedNever();

//                entity.Property(e => e.DealerId).HasColumnName("DealerID");

//                entity.Property(e => e.PortalUserId).HasColumnName("PortalUserID");
//            });

//            modelBuilder.Entity<PortalUserManufacturer>(entity =>
//            {
//                entity.Property(e => e.PortalUserManufacturerId)
//                    .HasColumnName("PortalUserManufacturerID")
//                    .ValueGeneratedNever();

//                entity.Property(e => e.ManufacturerTypeId).HasColumnName("ManufacturerTypeID");

//                entity.Property(e => e.PortalUserId).HasColumnName("PortalUserID");

//                entity.HasOne(d => d.PortalUser)
//                    .WithMany(p => p.PortalUserManufacturer)
//                    .HasForeignKey(d => d.PortalUserId)
//                    .OnDelete(DeleteBehavior.ClientSetNull)
//                    .HasConstraintName("FK_PortalUserManufacturer_PortalUser");
//            });

//            modelBuilder.Entity<PortalUserType>(entity =>
//            {
//                entity.Property(e => e.PortalUserTypeId)
//                    .HasColumnName("PortalUserTypeID")
//                    .ValueGeneratedNever();

//                entity.Property(e => e.PortalUserTypeName)
//                    .IsRequired()
//                    .HasMaxLength(50);
//            });

//            modelBuilder.Entity<StateProvince>(entity =>
//            {
//                entity.Property(e => e.CountryId)
//                    .HasColumnName("CountryID")
//                    .HasDefaultValueSql("((1))");

//                entity.Property(e => e.CreatedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

//                entity.Property(e => e.ModifiedBy)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

//                entity.Property(e => e.StateProvinceAbbreviation)
//                    .IsRequired()
//                    .HasMaxLength(50);

//                entity.Property(e => e.StateProvinceName)
//                    .IsRequired()
//                    .HasMaxLength(50);
//            });
//        }
    }
}
