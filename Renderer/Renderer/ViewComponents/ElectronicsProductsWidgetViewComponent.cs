using Microsoft.AspNetCore.Mvc;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Renderer.Services;
using Renderer.ViewModels;

namespace Renderer.ViewComponents
{
    [SitefinityWidget(Title = "Electronic Products List Widget")]
    public class ElectronicsProductsWidgetViewComponent : ViewComponent
    {
        private readonly IElectronicsProductService productService;

        public ElectronicsProductsWidgetViewComponent(IElectronicsProductService productService)
        {
            this.productService = productService;
        }

        public async Task<IViewComponentResult> InvokeAsync(IViewComponentContext<ElectronicsProductViewModel> context)
        {
            try
            {
                
                var productsVM = await productService.GetAllProductsAsync();
                return View("Default", productsVM);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR: {ex.Message}");
                return View("Default", new List<ElectronicsProductViewModel>());
            }
        }
    }
}
