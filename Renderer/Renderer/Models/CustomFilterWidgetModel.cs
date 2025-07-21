using Renderer.Entities;

namespace Renderer.Models
{
    public class CustomFilterWidgetModel
    {
        public List<string> FilterOptions { get; set; }
        public List<FilteredItem> Items { get; set; }
    }
}
