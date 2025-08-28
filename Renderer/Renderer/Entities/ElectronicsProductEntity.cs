using Progress.Sitefinity.RestSdk.Dto;

namespace Renderer.ViewModels
{
    [MappedSitefinityType("Telerik.Sitefinity.DynamicTypes.Model.Products.elctronics_products")]
    public class ElectronicsProductEntity: SdkItem
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string ItemDefaultUrl {  get; set; }
        public IEnumerable<LogoViewModel> ProductImage { get; set; } = new List<LogoViewModel>();
    }
}
