namespace Renderer.ViewModels
{
    public class ProductInfoViewModel
    {
        public int Index { get; set; }
        public string ProductTitleFieldName { get; set; }
        public string ProductDescriptionFieldName { get; set; }

        public string ProductTitleLabel { get; set; } = "Spellman Serial Number";
        public string ProductDescriptionLabel { get; set; } = "Failure/Problem/Error";

        public string ProductTitleValidationAttributes { get; set; }
        public string ProductDescriptionValidationAttributes { get; set; }

        public string ProductTitleValue { get; set; }
        public string ProductDescriptionValue { get; set; }
    }
}
