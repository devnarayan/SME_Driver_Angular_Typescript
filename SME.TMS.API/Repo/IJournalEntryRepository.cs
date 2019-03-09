using Microsoft.EntityFrameworkCore.Storage;
using SME.TMS.API.Interface;
using SME.TMS.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.TMS.API.Repo
{
    public interface IJournalEntryRepository
    {
        Task<List<TemplateDefinition>> GetTemplateDefinitionts();
        Task<List<TemplateDefinition>> GetTemplateDefinitiontById(int vendorId);

        void SetTimeout(int timeout);
        Task<int> SaveChanges();
        void Insert(object entity);
        void Attach(object entity);
        void Ignore(object entity);
        void Delete(object entity);
        bool IsChanged(object entity);
        int GetEntityState(object entity);
        Task<IDbContextTransaction> StartTransaction();
    }

    public interface IDriverRepository2
    {
        Task<List<TemplateDefinition>> GetTemplateDefinitionts();
        Task<List<TemplateDefinition>> GetTemplateDefinitiontByVendorId(int vendorId);
        Task<List<TemplateDefinitionModel>> GetTemplateDefinitiontAll();
        Task<TemplateDefinition> GetTemplateDefinitiontById(int id);
        Task<List<DriverTruckModel>> GetTruckDriverForContract();

        void SetTimeout(int timeout);
        Task<int> SaveChanges();
        void Insert(object entity);
        void Attach(object entity);
        void Ignore(object entity);
        void Delete(object entity);
        bool IsChanged(object entity);
        int GetEntityState(object entity);
        Task<IDbContextTransaction> StartTransaction();
    }
}
