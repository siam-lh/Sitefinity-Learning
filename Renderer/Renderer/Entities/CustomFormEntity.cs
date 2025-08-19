using Progress.Sitefinity.AspNetCore.Widgets.Models.Form;
using Progress.Sitefinity.Renderer.Designers.Attributes;
using System.ComponentModel;

namespace Renderer.Entities
{
    public class CustomFormEntity : FormViewModel
    {
        [ContentSection("Display settings", 10)]
        [DisplayName("Add a custom CSS class")]
        public string CustomCss { get; set; }

        [ContentSection("Display settings", 11)]
        [DisplayName("Show selected parent page")]
        public bool ShowParentPage { get; set; }
    }
}
