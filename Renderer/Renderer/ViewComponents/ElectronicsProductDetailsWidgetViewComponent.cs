using Microsoft.AspNetCore.Mvc;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Renderer.Services;
using Renderer.ViewModels;

namespace Renderer.ViewComponents
{
    [SitefinityWidget(Title = "Electronic Product Details Widget")]
    public class ElectronicsProductDetailsWidgetViewComponent : ViewComponent
    {
        private readonly IElectronicsProductService productService;

        public ElectronicsProductDetailsWidgetViewComponent(IElectronicsProductService productService)
        {
            this.productService = productService;
        }

        public async Task<IViewComponentResult> InvokeAsync(IViewComponentContext<ElectronicsProductViewModel> context)
        {
            //try
            //{
            //    var query = ViewContext.HttpContext.Request.Query;
            //    string productId = query["productId"];

            //    var productDetailsVM = await productService.GetProductByIdAsync(productId);
            //    return View("Default", productDetailsVM);
            //}
            //catch (Exception ex)
            //{
            //    Console.WriteLine($"ERROR: {ex.Message}");
            //    return View("Default", new ElectronicsProductViewModel());
            //}
            try
            {
                // Get the slug from route data instead of query string
                var routeData = ViewContext.RouteData;
                string slug = routeData.Values["slug"] as string;

                if (string.IsNullOrEmpty(slug))
                {
                    // Fallback: try to get from URL path segments
                    var path = ViewContext.HttpContext.Request.Path.Value;
                    slug = path.Split('/').LastOrDefault();
                }

                // Use the slug to get product details
                //var productDetailsVM = await productService.GetProductBySlugAsync(slug);
                return View("Default", new ElectronicsProductViewModel());
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR: {ex.Message}");
                return View("Default", new ElectronicsProductViewModel());
            }
        }
    }
}
