using Microsoft.AspNetCore.Mvc;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Renderer.Entities;

namespace Renderer.ViewComponents
{
    [SitefinityWidget]
    public class FooterLinksViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {
            // You can load this from Sitefinity or config
            var links = new List<FooterLinkEntity>
        {
            new FooterLinkEntity { Title = "Example 1", Url = "https://example1.com", IconUrl = "/icons/site1.svg" },
            new FooterLinkEntity { Title = "Example 2", Url = "https://example2.com" }
        };

            return View("Default", links);
        }
    }

}
