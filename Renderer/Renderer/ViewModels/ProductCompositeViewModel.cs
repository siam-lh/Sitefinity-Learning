namespace Renderer.ViewModels
{
    public class ProductCompositeViewModel
    {
        public string Label { get; set; }
        public string InstructionalText { get; set; }
        public string FieldName { get; set; }
        public string CssClass { get; set; }
        public string ViolationRestrictionsMessages { get; set; }
        public string ValidationAttributes { get; set; }
        public bool Readonly { get; set; }

        // Use the ProductInfoViewModel as a complex type
        public ProductInfoViewModel ProductInfo { get; set; } = new ProductInfoViewModel();

        public bool HasDescription
        {
            get
            {
                return !string.IsNullOrEmpty(this.InstructionalText);
            }
        }
    }
}
