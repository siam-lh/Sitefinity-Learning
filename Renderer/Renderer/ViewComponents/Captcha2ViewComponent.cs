using Microsoft.AspNetCore.Mvc;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Progress.Sitefinity.Renderer.Forms;

namespace Renderer.ViewComponents
{
    [SitefinityFormWidget(FormFieldType.Captcha, Title = "CAPTCHA 2", Order = 1, Section = WidgetSection.Other)]
    public class Captcha2ViewComponent : ViewComponent
    {

        public IViewComponentResult Invoke(IViewComponentContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            context.SetHideEmptyVisual(true);

            return this.View();
        }
    }
}
