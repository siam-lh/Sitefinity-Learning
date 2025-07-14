namespace Renderer.Models
{
    public class CompanyViewModel
    {
        public string Id { get; set; }
        public string Title { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public LogoViewModel? LogoUrl {  get; set; }
    }
}
