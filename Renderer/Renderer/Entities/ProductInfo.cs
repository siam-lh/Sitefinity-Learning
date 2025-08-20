using Progress.Sitefinity.Renderer.Designers;
using Progress.Sitefinity.Renderer.Designers.Attributes;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Renderer.Entities
{
    public class ProductInfo
    {
        [DisplayName("Spellman Serial Number")]
        //[DefaultValue("Product Title")]
        public string ProductTitleLabel { get; set; }

        [DisplayName("Failure/Problem/Error")]
        //[DefaultValue("Product Description")]
        public string ProductDescriptionLabel { get; set; }

        [DisplayName("Spellman Serial Number required")]
        [DataType(customDataType: KnownFieldTypes.CheckBox)]
        [Group("Options")]
        public bool ProductTitleRequired { get; set; }

        [DisplayName("Failure/Problem/Error required")]
        [DataType(customDataType: KnownFieldTypes.CheckBox)]
        [Group("Options")]
        public bool ProductDescriptionRequired { get; set; }

        [DisplayName("Product title error message if empty")]
        [DefaultValue("{0} is required")]
        public string ProductTitleRequiredErrorMessage { get; set; }

        [DisplayName("Product description error message if empty")]
        [DefaultValue("{0} is required")]
        public string ProductDescriptionRequiredErrorMessage { get; set; }
    }
}
