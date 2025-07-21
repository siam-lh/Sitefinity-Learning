using Microsoft.AspNetCore.Mvc;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Renderer.Entities;
using Renderer.Models;

namespace Renderer.ViewComponents
{
    [SitefinityWidget]
    public class CustomFilterWidgetViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(string filter = null)
        {
            var allItems = new List<FilteredItem>
        {
            new FilteredItem {
                Title = "ADI UK",
                PhoneLine1 = "0161 687",
                PhoneLine2 = "8787",
                Website = "https://adiuk.example.com",
                Region = "UK"
            },
            new FilteredItem {
                Title = "Oprema",
                PhoneLine1 = "01604 647",
                PhoneLine2 = "555",
                Website = "https://oprema.example.com",
                Region = "UK"
            },
            new FilteredItem {
                Title = "Wesco Anixter",
                PhoneLine1 = "0113 518",
                PhoneLine2 = "0000",
                Website = "https://wescoanixter.example.com",
                Region = "UK"
            },
        };

            var filteredItems = string.IsNullOrEmpty(filter)
                ? allItems
                : allItems.Where(i => i.Region.Equals(filter, StringComparison.OrdinalIgnoreCase)).ToList();

            var model = new CustomFilterWidgetModel
            {
                FilterOptions = new List<string> { "UK", "Europe", "Australasia", "Middle East" },
                Items = filteredItems
            };

            if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
                return View("_FilteredList", model.Items);

            return View("Default", model);
        }
    }
}
