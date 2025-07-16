using Progress.Sitefinity.RestSdk.Dto;
using Renderer.Models;

namespace Renderer.Entities
{
    [MappedSitefinityType("Telerik.Sitefinity.DynamicTypes.Model.Cars.Models")]
    public class CarModelItem : SdkItem
    {
        public string Title { get; set; }
        public string Model { get; set; }
        public string Description { get; set; }
        public string[] companyidentity { get; set; }
        public IEnumerable<CompanyItem> CompanyName { get; set; } = new List<CompanyItem>();
        public IEnumerable<LogoViewModel> Logo { get; set; } = new List<LogoViewModel>();
    }
}
