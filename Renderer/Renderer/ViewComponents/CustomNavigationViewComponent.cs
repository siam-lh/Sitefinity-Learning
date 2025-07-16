namespace Renderer.ViewComponents
{
    using Microsoft.AspNetCore.Mvc;
    using Progress.Sitefinity.AspNetCore.ViewComponents;
    using Renderer.Entities;
    using Renderer.Models;

    [SitefinityWidget(Title = "Custom Navigation")]
    public class CustomNavigationViewComponent : ViewComponent
    {
        private readonly ICustomNavigationModel model;

        public CustomNavigationViewComponent(ICustomNavigationModel model)
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
