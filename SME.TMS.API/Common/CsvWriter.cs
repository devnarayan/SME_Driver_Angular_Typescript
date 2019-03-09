using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SME.TMS.API.Common
{
    public class CsvWriter
    {
        private const string DELIMITER = ",";

        public string Write(IList list, bool includeHeader = true)
        {
            StringBuilder sb = new StringBuilder();

            Type type = list.GetType().GetGenericArguments()[0];

            //Get property collection and set selected property list
            PropertyInfo[] properties = type.GetProperties();

            //Add Header Names to Csv 
            if (includeHeader)
            {
                sb.AppendLine(this.CreateCsvHeaderLine(properties));
            }

            //Iterate through data list collection
            foreach (var item in list)
            {
                sb.AppendLine(this.CreateCsvLine(item, properties));
            }

            return sb.ToString();
        }
        public string WriteString(string list, bool includeHeader = true)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(list);
            return sb.ToString();
        }

        private string CreateCsvHeaderLine(PropertyInfo[] properties)
        {
            List<string> propertyValues = new List<string>();

            foreach (var prop in properties)
            {
                string formatString = string.Empty;
                string value = prop.Name;

                var attribute = prop.GetCustomAttribute(typeof(DisplayAttribute));
                if (attribute != null)
                {
                    value = (attribute as DisplayAttribute).Name;
                }

                this.CreateCsvStringItem(propertyValues, value);
            }

            return this.CreateCsvLine(propertyValues);
        }

        private string CreateCsvLine(object item, PropertyInfo[] properties)
        {
            List<string> propertyValues = new List<string>();

            try
            {

                foreach (var prop in properties)
                {
                    string formatString = string.Empty;
                    object value = prop.GetValue(item, null);

                    if (prop.PropertyType == typeof(string))
                    {
                        this.CreateCsvStringItem(propertyValues, value);
                    }
                    else if (prop.PropertyType == typeof(string[]))
                    {
                        this.CreateCsvStringArrayItem(propertyValues, value);
                    }
                    else if (prop.PropertyType == typeof(List<string>))
                    {
                        this.CreateCsvStringListItem(propertyValues, value);
                    }
                    else
                    {
                        this.CreateCsvItem(propertyValues, value);
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return this.CreateCsvLine(propertyValues);
        }

        private string CreateCsvLine(IList<string> list)
        {
            return string.Join(CsvWriter.DELIMITER, list);
        }

        private void CreateCsvItem(List<string> propertyValues, object value)
        {
            if (value != null)
            {
                propertyValues.Add(value.ToString());
            }
            else
            {
                propertyValues.Add(string.Empty);
            }
        }

        private void CreateCsvStringListItem(List<string> propertyValues, object value)
        {
            string formatString = "\"{0}\"";
            if (value != null)
            {
                value = this.CreateCsvLine((List<string>)value);
                propertyValues.Add(string.Format(formatString, this.ProcessStringEscapeSequence(value)));
            }
            else
            {
                propertyValues.Add(string.Empty);
            }
        }

        private void CreateCsvStringArrayItem(List<string> propertyValues, object value)
        {
            string formatString = "\"{0}\"";
            if (value != null)
            {
                value = this.CreateCsvLine(((string[])value).ToList());
                propertyValues.Add(string.Format(formatString, this.ProcessStringEscapeSequence(value)));
            }
            else
            {
                propertyValues.Add(string.Empty);
            }
        }

        private void CreateCsvStringItem(List<string> propertyValues, object value)
        {
            string formatString = "\"{0}\"";
            if (value != null)
            {
                propertyValues.Add(string.Format(formatString, this.ProcessStringEscapeSequence(value)));
            }
            else
            {
                propertyValues.Add(string.Empty);
            }
        }

        private string ProcessStringEscapeSequence(object value)
        {
            return value.ToString().Replace("\"", "\"\"");
        }
    }
}
