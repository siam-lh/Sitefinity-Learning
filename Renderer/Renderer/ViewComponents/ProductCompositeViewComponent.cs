using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Progress.Sitefinity.AspNetCore.FormWidgets.ViewComponents.Common;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Progress.Sitefinity.Renderer.Forms;
using Renderer.Entities;
using Renderer.ViewModels;
using System.Globalization;
using System.Text;
using System.Linq;

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

            // Map ProductInfo list to ProductInfoViewModel list
            if (entity.ProductInformationList != null && entity.ProductInformationList.Any())
            {
                for (int i = 0; i < entity.ProductInformationList.Count; i++)
                {
                    var productInfo = entity.ProductInformationList[i];
                    var productInfoViewModel = new ProductInfoViewModel
                    {
                        ProductTitleFieldName = $"{entity.SfFieldName}_ProductTitle_{i}",
                        ProductDescriptionFieldName = $"{entity.SfFieldName}_ProductDescription_{i}",
                        ProductTitleLabel = productInfo.ProductTitleLabel,
                        ProductDescriptionLabel = productInfo.ProductDescriptionLabel,
                        ProductTitleValidationAttributes = this.BuildValidationAttributes(productInfo.ProductTitleRequired),
                        ProductDescriptionValidationAttributes = this.BuildValidationAttributes(productInfo.ProductDescriptionRequired)
                    };
                    viewModel.ProductInfoList.Add(productInfoViewModel);
                }
            }
            else
            {
                // If no items in list, add at least one default item
                var defaultProductInfo = new ProductInfoViewModel
                {
                    ProductTitleFieldName = $"{entity.SfFieldName}_ProductTitle_0",
                    ProductDescriptionFieldName = $"{entity.SfFieldName}_ProductDescription_0",
                    ProductTitleLabel = "Product Title",
                    ProductDescriptionLabel = "Product Description",
                    ProductTitleValidationAttributes = "",
                    ProductDescriptionValidationAttributes = ""
                };
                viewModel.ProductInfoList.Add(defaultProductInfo);
            }

            viewModel.ValidationAttributes = this.BuildValidationAttributes(entity.Required);

            // Build validation messages for all product info items
            var validationMessages = new JObject();
            validationMessages["required"] = BuildValidationMessage(entity.Label, entity.RequiredErrorMessage ?? RequiredDefaultValidationMessage, RequiredDefaultValidationMessage);

            for (int i = 0; i < viewModel.ProductInfoList.Count; i++)
            {
                var productInfo = entity.ProductInformationList?.ElementAtOrDefault(i);
                if (productInfo != null)
                {
                    validationMessages[$"productTitleRequired_{i}"] = BuildValidationMessage(
                        productInfo.ProductTitleLabel,
                        productInfo.ProductTitleRequiredErrorMessage,
                        RequiredDefaultValidationMessage);

                    validationMessages[$"productDescriptionRequired_{i}"] = BuildValidationMessage(
                        productInfo.ProductDescriptionLabel,
                        productInfo.ProductDescriptionRequiredErrorMessage,
                        RequiredDefaultValidationMessage);
                }
            }

            viewModel.ViolationRestrictionsMessages = validationMessages.ToString();

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
