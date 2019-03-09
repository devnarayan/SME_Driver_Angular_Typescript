using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.Configuration;
using SME.TMS.API.Repo;
using SME.TMS.API.Interface;
using SME.TMS.API.Models;
using Microsoft.EntityFrameworkCore;
using SME.TMS.API.Workflows.Interfaces;
using System.Net;
using SME.TMS.API.Interface.Requests;
using SME.TMS.API.Interface.Responses;

namespace SME.TMS.API.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    [EnableCors("CorsPolicyAllowAll")]
    public class CashReceiptController : Controller
    {
        private readonly IConfiguration config;
        private readonly IDriverRepository repository;
        private readonly IPaymentWorkflow paymentWorkflow;

        public CashReceiptController(IPaymentWorkflow paymentWorkflow, IDriverRepository repository, IConfiguration config)
        {
            this.repository = repository;
            this.config = config;
            this.paymentWorkflow = paymentWorkflow;
        }

        [HttpPost]
        [ActionName("GetCashReceiptLookups")]
        public async Task<IActionResult> GetCashReceiptLookups([FromBody]GetCashReceiptLookupsRequest req)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            GetCashReceiptLookupsResponse resp = new GetCashReceiptLookupsResponse();


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
        [ActionName("GetCashReceiptList")]
        public async Task<IActionResult> GetCashReceiptList([FromBody]GetCashReceiptListRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            repository.SetTimeout(120);

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null || req.VendorId == null)
                return NotFound();

            var invoiceList = await repository.GetCashReceiptByManufacturerId((int)req.VendorId, user.CompanyId);

            GetCashReceiptListResponse resp = new GetCashReceiptListResponse();
            resp.CashReceipts = invoiceList.Where(x => x.TransactionStatusTypeId == (int)TransactionStatusType.Enum.Open).Select(x => paymentWorkflow.LoadCashReceipt(x)).ToList();
            resp.TotalVendors = resp.CashReceipts.Select(x => x.VendorId).Distinct().Count();
            resp.TotalOutstandingBalance = resp.CashReceipts.Select(x => x.ManufacturerRate).Sum();
            resp.CompletionPercentage = await repository.GetCashReceiptReconciledProgressPercent();

            return Ok(resp);
        }

        [HttpPost]
        [ActionName("SaveCashReceipt")]
        public async Task<IActionResult> SaveCashReceipt([FromBody]SaveCashReceiptRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            repository.SetTimeout(120);

            var user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            try
            {
                return Ok(await paymentWorkflow.SaveCashReceipt(user, req.CurrentCashReceipt));
            }
            catch (NullReferenceException e)
            {
                return NotFound(e.Message);
            }
            catch (UnauthorizedAccessException e)
            {
                return NotFound(e.Message);
            }
            catch (Exception e)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, e.Message);
            }
        }

        [HttpPost]
        [ActionName("SaveCashReceiptList")]
        public async Task<IActionResult> SaveCashReceiptList([FromBody]SaveCashReceiptListRequest req)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            repository.SetTimeout(120);

            PortalUser user = await repository.AuthenticateUserToken(req.CurrentUser.UserId, req.CurrentUser.UserToken);

            if (user == null)
                return NotFound();

            try
            {
                return Ok(await paymentWorkflow.SaveCashReceiptList(user, req.CashReceipts));
            }
            catch (NullReferenceException e)
            {
                return NotFound(e.InnerException.Message);
            }
            catch(UnauthorizedAccessException e)
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