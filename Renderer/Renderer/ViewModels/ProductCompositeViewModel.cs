using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Globalization;

namespace Renderer.ViewModels
{
    public class ProductCompositeViewModel
    {
        private const string RequiredDefaultValidationMessage = "{0} is required";

        public string Label { get; set; }
        public string InstructionalText { get; set; }
        public string FieldName { get; set; }
        public string CssClass { get; set; }
        public string ViolationRestrictionsMessages { get; set; }
        public string ValidationAttributes { get; set; }
        public bool Readonly { get; set; }
        public List<ProductInfoViewModel> ProductInfoList { get; set; } = new List<ProductInfoViewModel>();

        public bool HasDescription => !string.IsNullOrEmpty(InstructionalText);

        public static List<ProductInfoViewModel> CreateDefaultProductInfoList(string fieldName)
        {
            return new List<ProductInfoViewModel>
            {
                CreateDefaultProductInfo(fieldName, 0)
            };
        }

        private static ProductInfoViewModel CreateDefaultProductInfo(string fieldName, int index)
        {
            return new ProductInfoViewModel
            {
                Index = index,

                SpellmanSerialNumberFieldName = $"{fieldName}_spellmanSerialNumber_{index}",
                SpellmanSerialNumberLabel = "Spellman Serial Number",
                SpellmanSerialNumberValidationAttributes = BuildValidationAttributes(true),

                SpellmanPartNumberFieldName = $"{fieldName}_spellmanPartNumber_{index}",
                SpellmanPartNumberLabel = "Spellman Part Number",
                SpellmanPartNumberValidationAttributes = BuildValidationAttributes(false),

                RepairPO_ReferenceNumberFieldName = $"{fieldName}_repairPO_ReferenceNumber_{index}",
                RepairPO_ReferenceNumberLabel = "Repair PO/Reference Number",
                RepairPO_ReferenceNumberValidationAttributes = BuildValidationAttributes(false),

                FailureProblemErrorFieldName = $"{fieldName}_failureProblemError_{index}",
                FailureProblemErrorLabel = "Failure/Problem/Error",
                FailureProblemErrorValidationAttributes = BuildValidationAttributes(true),

                AdditionalEquipmentFieldName = $"{fieldName}_additionalEquipment_{index}",
                AdditionalEquipmentLabel = "Additional Equipment",
                AdditionalEquipmentValidationAttributes = BuildValidationAttributes(false),

                InstallationCountryFieldName = $"{fieldName}_installationCountry_{index}",
                InstallationCountryLabel = "Installation Country",
                InstallationCountryValidationAttributes = BuildValidationAttributes(false)
            };
        }

        public static JObject BuildValidationMessages(string label, string requiredErrorMessage)
        {
            return new JObject
            {
                ["required"] = BuildValidationMessage(label, requiredErrorMessage, RequiredDefaultValidationMessage),
                ["spellmanSerialNumberRequired"] = "Spellman Serial Number is required",
                ["failureProblemErrorRequired"] = "Failure/Problem/Error is required",
            };
        }

        private static string BuildValidationMessage(string fieldLabel, string actualMessage, string defaultMessage)
        {
            var message = string.IsNullOrEmpty(actualMessage) ? defaultMessage : actualMessage;
            return string.Format(CultureInfo.InvariantCulture, message, fieldLabel);
        }

        private static string BuildValidationAttributes(bool isRequired)
        {
            return isRequired ? @"required=""required"" " : string.Empty;
        }
    }
}
