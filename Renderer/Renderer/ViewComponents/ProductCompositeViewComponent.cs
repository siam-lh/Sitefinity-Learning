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
    [SitefinityFormWidget(FormFieldType.ShortText, Title = "Product Composite Field", EmptyIconText = "Enter product info", EmptyIcon = "list")]
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

            // Add one default product item with configurable requirements
            viewModel.ProductInfoList.Add(CreateDefaultProductInfo(entity.SfFieldName, 0, entity.ProductTitleRequired, entity.ProductDescriptionRequired));

            return this.View(viewModel);
        }

        private static ProductInfoViewModel CreateDefaultProductInfo(string fieldName, int index, bool titleRequired = true, bool descriptionRequired = true)
        {
            return new ProductInfoViewModel
            {
                Index = index,
                ProductTitleFieldName = $"{fieldName}_ProductTitle_{index}",
                ProductDescriptionFieldName = $"{fieldName}_ProductDescription_{index}",
                ProductTitleLabel = "Spellman Serial Number",
                ProductDescriptionLabel = "Failure/Problem/Error",
                ProductTitleValidationAttributes = BuildValidationAttributes(titleRequired),
                ProductDescriptionValidationAttributes = BuildValidationAttributes(descriptionRequired)
            };
        }

        private static JObject BuildValidationMessages(ProductCompositeEntity entity)
        {
            return new JObject
            {
                ["required"] = BuildValidationMessage(entity.Label, entity.RequiredErrorMessage, RequiredDefaultValidationMessage),
                // Add fixed validation messages for product fields if needed
                ["productTitleRequired"] = "Spellman Serial Number is required",
                ["productDescriptionRequired"] = "Failure/Problem/Error is required"
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