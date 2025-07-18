namespace Renderer.ViewComponents
{
    using Microsoft.AspNetCore.Mvc;
    using Progress.Sitefinity.AspNetCore.ViewComponents;
    using Renderer.Entities;
    using Renderer.Models;

    [SitefinityWidget(Title = "Extended Breadcrumb Navigation")]
    public class ExtendedBreadcrumbViewComponent : ViewComponent
    {
        private readonly IExtendedBreadcumbModel model;

        public ExtendedBreadcrumbViewComponent(IExtendedBreadcumbModel model)
        {
            this.model = model;
        }

        public async Task<IViewComponentResult> InvokeAsync(ICompositeViewComponentContext<ExtendedBreadcrumbEntity> context)
        {
            var viewModel = await model.Initialize(context.Entity);
            return View(viewModel);
        }
    }

}
