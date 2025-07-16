namespace Renderer.ViewModels
{
    public class LogoViewModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string AlternativeText { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public int Width { get; set; }
        public int Height { get; set; }
        public long FileSize { get; set; }
        public string MimeType { get; set; } = string.Empty;
        public string Extension { get; set; } = string.Empty;
    }
}
