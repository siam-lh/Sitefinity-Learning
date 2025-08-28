using Microsoft.AspNetCore.Mvc;
using Progress.Sitefinity.AspNetCore.FormWidgets.ViewComponents.Common;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Progress.Sitefinity.Renderer.Forms;
using Renderer.Entities;
using Renderer.ViewModels;

namespace Renderer.ViewComponents
{
    [SitefinityFormWidget(FormFieldType.Paragraph, Title = "Product Composite Field", EmptyIconText = "Enter product info", EmptyIcon = "list")]
    public class ProductCompositeViewComponent : ViewComponent
    {
        private readonly FormWidgetsStyleGenerator formWidgetsStyleGenerator;

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
                ValidationAttributes = entity.Required ? @"required=""required""" : string.Empty,
                ViolationRestrictionsMessages = ProductCompositeViewModel
                    .BuildValidationMessages(entity.Label, entity.RequiredErrorMessage)
                    .ToString(),
                ProductInfoList = ProductCompositeViewModel.CreateDefaultProductInfoList(entity.SfFieldName)
            };

            return this.View(viewModel);
        }
    }
}
