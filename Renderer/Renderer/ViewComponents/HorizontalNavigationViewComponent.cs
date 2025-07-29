namespace Renderer.ViewComponents
{
    using Microsoft.AspNetCore.Mvc;
    using Progress.Sitefinity.AspNetCore.ViewComponents;
    using Renderer.Entities;
    using Renderer.Models;

    [SitefinityWidget(Title = "MarkUp Tab Navigation")]
    public class HorizontalNavigationViewComponent : ViewComponent
    {
        private readonly ICustomNavigationModel model;

        public HorizontalNavigationViewComponent(ICustomNavigationModel model)
        {
            this.model = model;
        }

        public async Task<IViewComponentResult> InvokeAsync(ICompositeViewComponentContext<CustomNavigationEntity> context)
        {
            var viewModel = await model.Initialize(context.Entity);
            return View(viewModel);
        }
    }

}
