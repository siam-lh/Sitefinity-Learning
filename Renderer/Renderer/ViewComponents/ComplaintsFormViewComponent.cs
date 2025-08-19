using Microsoft.AspNetCore.Mvc;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Progress.Sitefinity.AspNetCore.Widgets.Models.Form;

namespace Renderer.ViewComponents
{
    [SitefinityWidget(Title = "Complaints Form (Fixed)", Category = "Forms")]
    public class ComplaintsFormViewComponent : ViewComponent
    {
        // Complaints form GUID
        private static readonly Guid ComplaintsFormId = new Guid("c9829917-f62e-4fc3-b8d9-2565fa97335d");

        public IViewComponentResult Invoke(IViewComponentContext context)
        {
            var model = new FormViewModel
            {
                //FormId = ComplaintsFormId
            };

            return View("~/Views/Shared/Components/Form/Default.cshtml", model);
        }
    }
}
