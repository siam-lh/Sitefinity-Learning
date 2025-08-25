using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Progress.Sitefinity.AspNetCore.FormWidgets.ViewComponents.Common;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Progress.Sitefinity.Renderer.Forms;
using Renderer.Entities;
using Renderer.ViewModels;
using System.Globalization;

namespace Renderer.ViewComponents
{
    [SitefinityFormWidget(FormFieldType.Paragraph, Title = "Product Composite Field", EmptyIconText = "Enter product info", EmptyIcon = "list")]
    public class ProductCompositeViewComponent : ViewComponent
    {
        private readonly FormWidgetsStyleGenerator formWidgetsStyleGenerator;
        private const string RequiredDefaultValidationMessage = "{0} is required";

        public ProductCompositeViewComponent(FormWidgetsStyleGenerator formWidgetsStyleGenerator)
        {
            this.formWidgetsStyleGenerator = formWidgetsStyleGenerator;
        }

        public IViewComponentResult Invoke(IViewComponentContext<ProductCompositeEntity> context)
        {
            if (context?.Entity == null)
                throw new ArgumentNullException(nameof(context));

            var entity = context.Entity;
            var viewModel = new ProductCompositeViewModel
            {
                CssClass = $"{entity.CssClass} {formWidgetsStyleGenerator.GetFieldSizeCss(entity.FieldSize)}".Trim(),
                Label = entity.Label,
                InstructionalText = entity.InstructionalText,
                FieldName = entity.SfFieldName,
                ValidationAttributes = BuildValidationAttributes(entity.Required),
                ViolationRestrictionsMessages = BuildValidationMessages(entity).ToString()
            };

            // Add one default product item with fixed field requirements
            viewModel.ProductInfoList.Add(CreateDefaultProductInfo(entity.SfFieldName, 0));

            return this.View(viewModel);
        }

        private static ProductInfoViewModel CreateDefaultProductInfo(string fieldName, int index)
        {
            return new ProductInfoViewModel
            {
                Index = index,

                // Spellman Serial Number (Required)
                SpellmanSerialNumberFieldName = $"{fieldName}_spellmanSerialNumber_{index}",
                SpellmanSerialNumberLabel = "Spellman Serial Number",
                SpellmanSerialNumberValidationAttributes = BuildValidationAttributes(true),

                // Spellman Part Number (Optional)
                SpellmanPartNumberFieldName = $"{fieldName}_spellmanPartNumber_{index}",
                SpellmanPartNumberLabel = "Spellman Part Number",
                SpellmanPartNumberValidationAttributes = BuildValidationAttributes(false),

                // Repair PO/Reference Number (Optional)
                RepairPO_ReferenceNumberFieldName = $"{fieldName}_repairPO_ReferenceNumber_{index}",
                RepairPO_ReferenceNumberLabel = "Repair PO/Reference Number",
                RepairPO_ReferenceNumberValidationAttributes = BuildValidationAttributes(false),

                // Failure/Problem/Error (Required)
                FailureProblemErrorFieldName = $"{fieldName}_failureProblemError_{index}",
                FailureProblemErrorLabel = "Failure/Problem/Error",
                FailureProblemErrorValidationAttributes = BuildValidationAttributes(true),

                // Additiona lEquipment (Optional)
                AdditionalEquipmentFieldName = $"{fieldName}_additionalEquipment_{index}",
                AdditionalEquipmentLabel = "Additional Equipment",
                AdditionalEquipmentValidationAttributes = BuildValidationAttributes(false),

                  // Installation Country (Optional)
                InstallationCountryFieldName = $"{fieldName}_installationCountry_{index}",
                InstallationCountryLabel = "Installation Country",
                InstallationCountryValidationAttributes = BuildValidationAttributes(false)
            };
        }

        private static JObject BuildValidationMessages(ProductCompositeEntity entity)
        {
            return new JObject
            {
                ["required"] = BuildValidationMessage(entity.Label, entity.RequiredErrorMessage, RequiredDefaultValidationMessage),
                ["spellmanSerialNumberRequired"] = "Spellman Serial Number is required",
                ["spellmanPartNumberRequired"] = "Spellman Part Number is required",
                ["repairPO_ReferenceNumberRequired"] = "Repair PO/Reference Number is required",
                ["failureProblemErrorRequired"] = "Failure/Problem/Error is required",
                ["additionalEquipmentRequired"] = "Additional Equipment is required",
                ["installationCountryRequired"] = "Installation Countryt is required"
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
