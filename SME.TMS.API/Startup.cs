using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using Microsoft.EntityFrameworkCore;
using SME.TMS.API.Models;
using SME.TMS.API.Repo;
using SME.TMS.API.Workflows.Interfaces;
using SME.TMS.API.Workflows;
using SME.TMS.API.Common;
using System.Net.Http.Headers;

namespace SME.TMS.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicyAllowAll",
                    builder => builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });

            // Add framework services.
            services.AddMvc(options => options.OutputFormatters.Add(new CsvOutputFormatter()));

            services.AddDbContext<SMEDispatchDEVContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IJournalEntryRepository, JournalEntryRepository>();
            services.AddScoped<IDriverRepository2, DriverRepository2>();
            services.AddScoped<IDriverRepository, DriverRepository>();

            services.AddScoped<IPaymentWorkflow, PaymentWorkflow>();

            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseCors("CorsPolicyAllowAll");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseMvc();

            //app.UseExceptionHandler(appBuilder =>
            //{
            //    appBuilder.Run(async context =>
            //    {
            //        context.Response.Headers.Add("Access-Control-Allow-Origin", "*");   // I needed to add this otherwise in Angular I Would get "Response with status: 0 for URL"
            //        context.Response.StatusCode = 500;
            //        await context.Response.WriteAsync("Internal Server Error");
            //    });
            //});
        }
    }
}
