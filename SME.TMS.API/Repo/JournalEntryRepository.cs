using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using SME.TMS.API.Interface;
using SME.TMS.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace SME.TMS.API.Repo
{
    public class JournalEntryRepository : IJournalEntryRepository
    {
        private readonly SMEDispatchDEVContext _context;
        JournalEntryRepository(SMEDispatchDEVContext context)
        {
            _context = context;
        }

        public async Task<List<TemplateDefinition>> GetTemplateDefinitionts()
        {
            return await _context.TemplateDefinition
                 .ToListAsync();
        }

        public async Task<List<TemplateDefinition>> GetTemplateDefinitiontById(int vendorId)
        {
            return await _context.TemplateDefinition
                 .Where(x => x.VendorId == vendorId).ToListAsync();
        }


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
    }

    public class DriverRepository2 : IDriverRepository2
    {
        private readonly SMEDispatchDEVContext _context;

        public DriverRepository2(SMEDispatchDEVContext context)
        {
            _context = context;
        }
        public async Task<List<TemplateDefinition>> GetTemplateDefinitionts()
        {
            return await _context.TemplateDefinition
                 .ToListAsync();
        }

        public async Task<List<TemplateDefinition>> GetTemplateDefinitiontByVendorId(int vendorId)
        {
            return await _context.TemplateDefinition
                 .Where(x => x.VendorId == vendorId).ToListAsync();
        }
        public async Task<List<TemplateDefinitionModel>> GetTemplateDefinitiontAll()
        {
            var data = await _context.TemplateDefinition
                .Select(st => new TemplateDefinitionModel
                {
                    TemplateDefinitionId = st.TemplateDefinitionId,
                    TemplateDefinitionDesc = st.TemplateDefinitionDesc,
                    TemplateDefinitionName = st.TemplateDefinitionName,
                    TemplateDefinitionSchema = st.TemplateDefinitionSchema,
                    VendorId = st.VendorId,
                    OpenCount = st.ImportedExpenses.Count()
                })
                .ToListAsync();
            return data;
        }
        public async Task<TemplateDefinition> GetTemplateDefinitiontById(int id)
        {

            return await _context.TemplateDefinition
                 .Where(x => x.TemplateDefinitionId == id).FirstOrDefaultAsync();
        }
        public async Task<List<DriverTruckModel>> GetTruckDriverForContract()
        {
            var data = await (from d in _context.Driver
                              join cd in _context.DriverContract on d.DriverId equals cd.DriverId
                              join c in _context.Contract on cd.ContractId equals c.ContractId
                              join ctt in _context.ContractTruck on c.ContractId equals ctt.ContractId
                              join t in _context.Truck on ctt.TruckId equals t.TruckId
                              select new DriverTruckModel
                              {
                                  DriverId = d.DriverId,
                                  TruckId = t.TruckId,
                                  DriverName = (d.FirstName == null ? "" : d.FirstName) + " " + d.LastName == null ? "" : d.LastName,
                                  TruckNumber = t.TruckNumber,
                                  ContractId = c.ContractId,
                                  ContractName = c.ContractName
                              }
                        ).ToListAsync();

            return data;
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
    }
}
