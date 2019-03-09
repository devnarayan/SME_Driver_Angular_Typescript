using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SME.TMS.API.Repo;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Cors;
using SME.TMS.API.Interface;
using SME.TMS.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Net;
using SME.TMS.API.Workflows;
using SME.TMS.API.Workflows.Interfaces;
using SME.TMS.API.Interface.Requests;
using SME.TMS.API.Interface.Responses;

namespace SME.TMS.API.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    [EnableCors("CorsPolicyAllowAll")]
    public class InvoiceController : Controller
    {
        private readonly IConfiguration config;
        private readonly IDriverRepository repository;
        private readonly IPaymentWorkflow paymentWorkflow;

        public InvoiceController(IPaymentWorkflow paymentWorkflow, IDriverRepository repository, IConfiguration config)
        {
            this.repository = repository;
            this.config = config;
            this.paymentWorkflow = paymentWorkflow;
        }

        [HttpPost]
        [ActionName("GetInvoiceLookups")]
        public async Task<IActionResult> GetInvoiceLookups([FromBody]GetInvoiceLookupsRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            GetInvoiceLookupsResponse resp = new GetInvoiceLookupsResponse();


            var vendors = await repository.GetAllManufacturers();
            foreach (Manufacturer m in vendors)
            {
                resp.Vendors.Add(new VendorModel
                {
                    VendorId = m.ManufacturerId,
                    VendorName = m.ManufacturerName
                });
            }
            resp.LogoData = user.ReferencingCompany.Logo;

            return Ok(resp);
        }

        [HttpPost]
        [ActionName("GetInvoiceList")]
        public async Task<IActionResult> GetInvoiceList([FromBody]GetInvoiceListRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            repository.SetTimeout(120);

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null || req.VendorId == null)
                return NotFound();

            var invoiceList = await repository.GetInvoicesByManufacturerId((int)req.VendorId, user.CompanyId);

            GetInvoiceListResponse resp = new GetInvoiceListResponse();
            resp.Invoices = invoiceList.Where(x => x.TransactionStatusTypeId == (int)TransactionStatusType.Enum.Open).Select(x => paymentWorkflow.LoadInvoice(x)).ToList();
            resp.TotalVendors = resp.Invoices.Select(x => x.VendorId).Distinct().Count();
            resp.TotalOutstandingBalance = resp.Invoices.Select(x => x.ManufacturerRate).Sum();
            resp.CompletionPercentage = await repository.GetInvoiceAcknowledgedProgressPercent();

            return Ok(resp);

        }


        [HttpPost]
        [ActionName("GetCommissionsList")]
        public async Task<IActionResult> GetCommissionsList([FromBody]GetCommissionsListRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            repository.SetTimeout(120);

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            var invoiceList = (await repository.GetInvoicesByDriverId(req.DriverId)).Where(x => x.CompanyId == user.CompanyId).ToList();

            GetInvoiceListResponse resp = new GetInvoiceListResponse()
            {
                Invoices = invoiceList.Select(x => paymentWorkflow.LoadInvoice(x)).ToList()
            };

            return Ok(resp);
        }

        [HttpPost]
        [ActionName("SaveInvoice")]
        public async Task<IActionResult> SaveInvoice([FromBody]SaveInvoiceRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            repository.SetTimeout(120);

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            try
            {
                return Ok(await paymentWorkflow.SaveInvoice(user, req.CurrentInvoice));
            }
            catch (NullReferenceException e)
            {
                return NotFound(e.Message);
            }
            catch(UnauthorizedAccessException e)
            {
                return NotFound(e.Message);
            }
            catch(Exception e)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
            }
        }

        [HttpPost]
        [ActionName("SaveInvoiceList")]
        public async Task<IActionResult> SaveInvoiceList([FromBody]SaveInvoiceListRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            repository.SetTimeout(120);

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            try
            {
                return Ok(await paymentWorkflow.SaveInvoiceList(user, req.Invoices));
            }
            catch (NullReferenceException e)
            {
                return NotFound(e.InnerException.Message);
            }
            catch (UnauthorizedAccessException e)
            {
                return NotFound(e.InnerException.Message);
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, e.InnerException?.Message ?? e.Message);
            }
        }
    }
}