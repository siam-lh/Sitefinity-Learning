using Renderer.Entities;

namespace Renderer.ViewModels
{
    public class WhereToBuyViewModel
    {
        public string Region { get; set; }
        public string SubRegion { get; set; }
        public List<CompanyEntity> Items { get; set; }

        public List<string> AvailableRegions { get; set; }
        public List<string> AvailableSubRegions { get; set; }
        public Dictionary<string, List<string>> Regions { get; set; }
    }
}
