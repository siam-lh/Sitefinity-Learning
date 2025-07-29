using Microsoft.AspNetCore.Mvc;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Renderer.SD;
using Renderer.ViewModels;

namespace Renderer.ViewComponents
{
    [SitefinityWidget]
    public class SideBarViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            string region = HttpContext.Request.Query["region"];
            string subregion = HttpContext.Request.Query["subregion"];
            var allItems = MockContentService.GetItems();

            // If no region is specified, select the first available region
            if (string.IsNullOrEmpty(region) && allItems.Any())
            {
                region = allItems.Select(i => i.Region).Distinct().FirstOrDefault();
            }

            var filteredItems = allItems
                .Where(i => string.IsNullOrEmpty(region) || i.Region == region)
                .Where(i => string.IsNullOrEmpty(subregion) || i.SubRegion == subregion)
                .ToList();

            var model = new WhereToBuyViewModel
            {
                Region = region,
                SubRegion = subregion,
                Items = filteredItems,
                Regions = MockContentService.regions,
                AvailableRegions = allItems.Select(i => i.Region).Distinct().ToList(),
                AvailableSubRegions = allItems
                    .Where(i => string.IsNullOrEmpty(region) || i.Region == region)
                    .Select(i => i.SubRegion).Distinct().ToList()
            };
            return View("Default", model);
        }
    }
}