using System.Globalization;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Renderer.ViewModels;
using Progress.Sitefinity.AspNetCore.FormWidgets.ViewComponents.Common;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Progress.Sitefinity.Renderer.Forms;
using Renderer.Entities;

namespace Renderer.ViewComponents
{
    [SitefinityFormWidget(FormFieldType.ShortText, Title = "Custom Date input", EmptyIconText = "Enter date", EmptyIcon = "calendar")]
    public class DateInputViewComponent : ViewComponent
    {
        private FormWidgetsStyleGenerator formWidgetsStyleGenerator;
        private const string RequiredDefaultValidationMessage = "{0} field is required";

        public DateInputViewComponent(FormWidgetsStyleGenerator formWidgetsStyleGenerator)
        {
            this.formWidgetsStyleGenerator = formWidgetsStyleGenerator;
        }

        /// <summary>
        /// Invokes the view.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public IViewComponentResult Invoke(IViewComponentContext<DateInputEntity> context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            var entity = context.Entity;
            var viewModel = new DateInputViewModel();
            viewModel.CssClass = entity.CssClass + " " + this.formWidgetsStyleGenerator.GetFieldSizeCss(entity.FieldSize);
            viewModel.Label = entity.Label;
            viewModel.InstructionalText = entity.InstructionalText;
            viewModel.FieldName = entity.SfFieldName;
            viewModel.ValidationAttributes = this.BuildValidationAttributes(entity);
            viewModel.ViolationRestrictionsMessages = JObject.FromObject(new
            {
                required = BuildValidationMessage(entity.Label, entity.RequiredErrorMessage, RequiredDefaultValidationMessage),
            }).ToString();

            return this.View(viewModel);
        }

        private static string BuildValidationMessage(string textFieldLabel, string actualMessage, string defaultMessage)
        {
            actualMessage = string.IsNullOrEmpty(actualMessage) ? defaultMessage : actualMessage;
            string result = string.Format(CultureInfo.InvariantCulture, actualMessage, textFieldLabel);

            return result;
        }

        private string BuildValidationAttributes(DateInputEntity entity)
        {
            var attributes = new StringBuilder();

            if (entity.Required)
                attributes.Append(@"required=""required"" ");

            return attributes.ToString();
        }

    }
}
