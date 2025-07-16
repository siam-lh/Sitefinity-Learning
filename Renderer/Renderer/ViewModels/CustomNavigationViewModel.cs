using Progress.Sitefinity.AspNetCore.Widgets.Models.Navigation;

namespace Renderer.ViewModels
{
    public class CustomNavigationViewModel
    {
        public IList<PageViewModel> Nodes { get; set; }
        public string WrapperCssClass { get; set; }
    }
}
