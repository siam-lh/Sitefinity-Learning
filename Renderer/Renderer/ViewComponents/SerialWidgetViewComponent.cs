using Microsoft.AspNetCore.Mvc;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Progress.Sitefinity.Renderer.Forms;
using Renderer.Entities;
using Renderer.ViewModels;

namespace Renderer.ViewComponents
{
    [SitefinityFormWidget(FormFieldType.ShortText, Title = "Serial Widget")]
    public class SerialWidgetViewComponent : ViewComponent
    {

        public IViewComponentResult Invoke(IViewComponentContext<SerialWidgetViewModel> context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            return this.View(context.Entity);
        }
    }
}
