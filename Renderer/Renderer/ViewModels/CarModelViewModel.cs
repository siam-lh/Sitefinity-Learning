using Renderer.Entities;

namespace Renderer.ViewModels
{
    public class CarModelViewModel
    {
        public string Id { get; set; }
        public string Title { get; set; }

        public string Model { get; set; }
        public string Description { get; set; }
        public LogoViewModel? LogoUrl {  get; set; }
        public CompanyItem? Company { get; set; }
    }
}
