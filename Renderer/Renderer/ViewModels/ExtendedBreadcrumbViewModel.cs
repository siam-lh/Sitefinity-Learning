using Progress.Sitefinity.AspNetCore.Widgets.Models.Breadcrumb;
using Progress.Sitefinity.RestSdk.Clients.Pages.Dto;

namespace Renderer.ViewModels
{
    public class ExtendedBreadcrumbViewModel
    {
        public IList<PageNodeDto> Items { get; set; }
        public string WrapperCssClass { get; set; }
    }
}
