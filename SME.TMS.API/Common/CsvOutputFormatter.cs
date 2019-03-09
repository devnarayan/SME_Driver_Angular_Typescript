using Microsoft.AspNetCore.Mvc.Formatters;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SME.TMS.API.Common
{
    public class CsvOutputFormatter : IOutputFormatter
    {

        public bool CanWriteResult(OutputFormatterCanWriteContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            if (context.ContentType == null || context.ContentType.ToString() == "text/csv")
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task WriteAsync(OutputFormatterWriteContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            var response = context.HttpContext.Response;
            response.ContentType = "text/csv";

            using (var writer = context.WriterFactory(response.Body, Encoding.UTF8))
            {
                //IList lst = context.Object as IList;
                string lst = context.Object as string;
                CsvWriter csvWriter = new CsvWriter();

                string csv = csvWriter.WriteString(lst, true);

                writer.Write(csv);

                await writer.FlushAsync();
            }
        }
    }
}
