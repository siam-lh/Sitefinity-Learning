using Progress.Sitefinity.RestSdk.Dto;
using Renderer.Models;

namespace Renderer.Entities
{
    [MappedSitefinityType("Telerik.Sitefinity.DynamicTypes.Model.Cars.Company")]
    public class CompanyItem : SdkItem
    {
        public string Title { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public IEnumerable<LogoViewModel> Logo { get; set; } = new List<LogoViewModel>();
    }
}
