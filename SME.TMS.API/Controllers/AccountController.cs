using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks; 
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using SME.TMS.API.Interface;
using SME.TMS.API.Models;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cors;
using SME.TMS.API.Repo;
using SME.TMS.API.Interface.Responses;

namespace SME.TMS.API.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]/[action]")]
    [EnableCors("CorsPolicyAllowAll")]
    public class AccountController : Controller
    {

        private readonly IDriverRepository repository;
        private readonly IConfiguration config;

        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        public AccountController(IDriverRepository repository, IConfiguration configuration)
        {
            config = configuration;
            this.repository = repository;
        }

        //[HttpPost(Name = "LoginUser")]
        //[AcceptVerbs("POST")]
        //[ActionName("LoginUser")]
        [HttpPost]
        [ActionName("LoginUser")]
        public async Task<IActionResult> Login([FromBody]UserModel user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var portalUser = await repository.GetPortalUserByUsername(user.UserName);
            if (portalUser == null)
            {
                return NotFound();
            }
            else
            {
                //THIS IS THE STANDARD DEALER MANUFACTURER PORTALUSER PATH
                // Create Hashing object to has the attempted password and a 32-bit salt.
                Rfc2898DeriveBytes pbkdf2 = new Rfc2898DeriveBytes(user.Password, 32);
                pbkdf2.IterationCount = 1000;

                //Set the salt.
                pbkdf2.Salt = Convert.FromBase64String(portalUser.Salt);
                // Hash Password
                byte[] hash = pbkdf2.GetBytes(32);
                // Compare.
                if (portalUser.PortalPassword.Equals(Convert.ToBase64String(hash)))
                {
                    UserModel um = new UserModel();
                    um.UserId = portalUser.PortalUserId;
                    um.UserName = portalUser.PortalUsername;
                    um.PrimaryAssociation = "";
                    um.PortalUserTypeId = portalUser.PortalUserTypeId ?? 0;


                    MessageLog log = new MessageLog();
                    log.CreatedBy = um.UserName;
                    log.MessageDesc = String.Format("Login by user: {0}",um.UserName);
                    log.CreatedDate = DateTime.UtcNow;

                    repository.Insert(log);
                    await repository.SaveChanges();

                    
                    return Ok(um);
                }
                else
                {
                    return NotFound();
                }
            }

        }

        //[HttpPost(Name = "LoginUserTest")]
        //[AcceptVerbs("GET")]
        //[ActionName("LoginUserTest")]
        [HttpGet]
        [ActionName("LoginUserTest")]
        public async Task<IActionResult> LoginTest()
        {
            UserModel user = new UserModel();

            user.UserName = "btrozzo@virtualsails.com";
            user.Password = "123456";

            var portalUser = await repository.GetPortalUserByUsername(user.UserName);
            if (portalUser == null)
            {
                return NotFound();
            }
            else
            {
                //THIS IS THE STANDARD DEALER MANUFACTURER PORTALUSER PATH
                // Create Hashing object to has the attempted password and a 32-bit salt.
                Rfc2898DeriveBytes pbkdf2 = new Rfc2898DeriveBytes(user.Password, 32);
                pbkdf2.IterationCount = 1000;

                //Set the salt.
                pbkdf2.Salt = Convert.FromBase64String(portalUser.Salt);
                // Hash Password
                byte[] hash = pbkdf2.GetBytes(32);
                // Compare.
                if (portalUser.PortalPassword.Equals(Convert.ToBase64String(hash)))
                {
                    UserModel um = new UserModel();
                    um.UserId = portalUser.PortalUserId;
                    um.UserName = portalUser.PortalUsername;
                    um.PrimaryAssociation = "";
                    um.PortalUserTypeId = portalUser.PortalUserTypeId ?? 0;

                    List<UserModel> users = new List<UserModel>();
                    users.Add(um);

                    return Ok(users);
                }
                else
                {
                    return NotFound();
                }
            }
        }

        //[HttpPost(Name = "LoginUser")]
        //[AcceptVerbs("POST")]
        //[ActionName("LoginUser")]
        [HttpPost]
        [ActionName("LoginUserGetAllAccounts")]
        public async Task<IActionResult> LoginGetAllAccounts([FromBody]UserModel user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var portalUser = await repository.GetPortalUserByUsername(user.UserName);
            if (portalUser == null)
            {
                return NotFound();
            }
            else
            {
                //THIS IS THE STANDARD DEALER MANUFACTURER PORTALUSER PATH
                // Create Hashing object to has the attempted password and a 32-bit salt.
                Rfc2898DeriveBytes pbkdf2 = new Rfc2898DeriveBytes(user.Password, 32);
                pbkdf2.IterationCount = 1000;

                //Set the salt.
                pbkdf2.Salt = Convert.FromBase64String(portalUser.Salt);
                // Hash Password
                byte[] hash = pbkdf2.GetBytes(32);
                // Compare.
                if (portalUser.PortalPassword.Equals(Convert.ToBase64String(hash)))
                {
                    UserModel um = new UserModel();
                    um.UserId = portalUser.PortalUserId;
                    um.UserName = portalUser.PortalUsername;
                    um.PrimaryAssociation = "";
                    um.PortalUserTypeId = portalUser.PortalUserTypeId ?? 0;

                    List<UserModel> users = new List<UserModel>();
                    users.Add(um);

                    return Ok(users);
                }
                else
                {
                    return NotFound();
                }
            }

        }

        [HttpPost]
        [ActionName("GetUserCompanyLogo")]
        public async Task<IActionResult> GetUserCompanyLogo([FromBody]UserModel user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var portalUser = await repository.AuthenticateUser(user.UserName, user.Password);

            if (portalUser == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(portalUser.ReferencingCompany.Logo);
            }
        }

        [HttpPost]
        [ActionName("GetGLAccountsList")]
        public async Task<IActionResult> GetGLAccountsList([FromBody]UserModel user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var portalUser = await repository.AuthenticateUser(user.UserName, user.Password);

            if (portalUser == null)
            {
                return NotFound();
            }
            else
            {
                GetAllGLAccountsResponse resp = new GetAllGLAccountsResponse();
                var accounts = await repository.GetAllGLAccounts();

                resp.DriverAccounts = accounts.Where(x => x.GLAccountTypeID == (int)GLAccountType.Enum.Driver).Select(x => x.GLAccountString).ToList();
                resp.CompanyAccounts = accounts.Where(x => x.GLAccountTypeID == (int)GLAccountType.Enum.SME).Select(x => x.GLAccountString).ToList();

                return Ok(resp);
            }
        }

    }
}