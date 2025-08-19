using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Progress.Sitefinity.AspNetCore.FormWidgets.ViewComponents.Common;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Progress.Sitefinity.Renderer.Forms;
using Renderer.Entities;
using Renderer.ViewModels;
using System.Globalization;
using System.Text;

namespace Renderer.ViewComponents
{
    [SitefinityFormWidget(FormFieldType.ShortText, Title = "Product Composite Field", EmptyIconText = "Enter product info", EmptyIcon = "list")]
    public class ProductCompositeViewComponent : ViewComponent
    {
        private FormWidgetsStyleGenerator formWidgetsStyleGenerator;
        private const string RequiredDefaultValidationMessage = "{0} is required";

        public ProductCompositeViewComponent(FormWidgetsStyleGenerator formWidgetsStyleGenerator)
        {
            this.formWidgetsStyleGenerator = formWidgetsStyleGenerator;
        }

        public IViewComponentResult Invoke(IViewComponentContext<ProductCompositeEntity> context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            var entity = context.Entity;
            var viewModel = new ProductCompositeViewModel();

            viewModel.CssClass = entity.CssClass + " " + this.formWidgetsStyleGenerator.GetFieldSizeCss(entity.FieldSize);
            viewModel.Label = entity.Label;
            viewModel.InstructionalText = entity.InstructionalText;
            viewModel.FieldName = entity.SfFieldName;

            // Map ProductInfo properties
            viewModel.ProductInfo.ProductTitleFieldName = entity.SfFieldName + "_ProductTitle";
            viewModel.ProductInfo.ProductDescriptionFieldName = entity.SfFieldName + "_ProductDescription";
            viewModel.ProductInfo.ProductTitleLabel = entity.ProductInformation.ProductTitleLabel;
            viewModel.ProductInfo.ProductDescriptionLabel = entity.ProductInformation.ProductDescriptionLabel;
            viewModel.ProductInfo.ProductTitleValidationAttributes = this.BuildValidationAttributes(entity.ProductInformation.ProductTitleRequired);
            viewModel.ProductInfo.ProductDescriptionValidationAttributes = this.BuildValidationAttributes(entity.ProductInformation.ProductDescriptionRequired);

            viewModel.ValidationAttributes = this.BuildValidationAttributes(entity.Required);

            viewModel.ViolationRestrictionsMessages = JObject.FromObject(new
            {
                required = BuildValidationMessage(entity.Label, entity.RequiredErrorMessage ?? RequiredDefaultValidationMessage, RequiredDefaultValidationMessage),
                productTitleRequired = BuildValidationMessage(entity.ProductInformation.ProductTitleLabel, entity.ProductInformation.ProductTitleRequiredErrorMessage, RequiredDefaultValidationMessage),
                productDescriptionRequired = BuildValidationMessage(entity.ProductInformation.ProductDescriptionLabel, entity.ProductInformation.ProductDescriptionRequiredErrorMessage, RequiredDefaultValidationMessage),
            }).ToString();

            return this.View(viewModel);
        }

        private static string BuildValidationMessage(string fieldLabel, string actualMessage, string defaultMessage)
        {
            actualMessage = string.IsNullOrEmpty(actualMessage) ? defaultMessage : actualMessage;
            string result = string.Format(CultureInfo.InvariantCulture, actualMessage, fieldLabel);
            return result;
        }

        private string BuildValidationAttributes(bool isRequired)
        {
            var attributes = new StringBuilder();
            if (isRequired)
                attributes.Append(@"required=""required"" ");
            return attributes.ToString();
        }
    }
}
