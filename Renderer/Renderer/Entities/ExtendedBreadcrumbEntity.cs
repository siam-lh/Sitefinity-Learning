using Progress.Sitefinity.AspNetCore.Widgets.Models.Breadcrumb;
using Progress.Sitefinity.Renderer.Designers.Attributes;
using System.ComponentModel;

namespace Renderer.Entities
{
    public class ExtendedBreadcrumbEntity : BreadcrumbEntity
    {
        [ContentSection("Display settings", 10)]
        [DisplayName("Add a custom CSS class")]
        public string CustomCss { get; set; }

        [ContentSection("Display settings", 11)]
        [DisplayName("Show selected parent page")]
        public bool ShowParentPage { get; set; }
    }
}
