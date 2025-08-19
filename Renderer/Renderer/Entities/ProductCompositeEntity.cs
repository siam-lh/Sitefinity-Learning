using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Progress.Sitefinity.AspNetCore;
using Progress.Sitefinity.AspNetCore.FormWidgets.Entities;
using Progress.Sitefinity.AspNetCore.ViewComponents.AttributeConfigurator.Attributes;
using Progress.Sitefinity.Renderer.Contracts.Forms;
using Progress.Sitefinity.Renderer.Designers;
using Progress.Sitefinity.Renderer.Designers.Attributes;

namespace Renderer.Entities
{
    [SectionsOrder(Constants.ContentSectionTitles.LabelsAndContent, Constants.ContentSectionTitles.Limitations, Constants.ContentSectionTitles.DisplaySettings)]
    public class ProductCompositeEntity : IFormFieldContract
    {
        [ContentSection(Constants.ContentSectionTitles.LabelsAndContent, 1)]
        [DefaultValue("Product Information")]
        public string Label { get; set; }

        [Description("Suitable for giving examples how the entered values will be used.")]
        [ContentSection(Constants.ContentSectionTitles.LabelsAndContent, 2)]
        [DisplayName("Instructional text")]
        public string InstructionalText { get; set; }

        // Import ProductInfo as a complex type
        [ContentSection(Constants.ContentSectionTitles.LabelsAndContent, 3)]
        [DisplayName("Product Information")]
        public ProductInfo ProductInformation { get; set; } = new ProductInfo();

        [ContentSection(Constants.ContentSectionTitles.LabelsAndContent, 7)]
        [DisplayName("Required field")]
        [DataType(customDataType: KnownFieldTypes.CheckBox)]
        [Group("Options")]
        public bool Required { get; set; }

        [ContentSection(Constants.ContentSectionTitles.LabelsAndContent, 8)]
        [DisplayName("Hide field initially (use form rules to display it)")]
        [DataType(customDataType: KnownFieldTypes.CheckBox)]
        [Group("Options")]
        public bool Hidden { get; set; }

        [DisplayName("Error message if the field is empty")]
        [ContentSection(Constants.ContentSectionTitles.LabelsAndContent, 9)]
        [DefaultValue("{0} field is required")]
        [ConditionalVisibility("{\"conditions\":[{\"fieldName\":\"Required\",\"operator\":\"Equals\",\"value\":true}]}")]
        public string RequiredErrorMessage { get; set; }

        [ViewSelector]
        [ContentSection(Constants.ContentSectionTitles.DisplaySettings)]
        [DisplayName("Template")]
        public string SfViewName { get; set; }

        [ContentSection(Constants.ContentSectionTitles.DisplaySettings)]
        [DisplayName("Field size")]
        [DataType(KnownFieldTypes.ChipChoice)]
        public FieldSize FieldSize { get; set; }

        [Category(PropertyCategory.Advanced)]
        [ContentSection("AdvancedMain", 2)]
        [DisplayName("CSS class")]
        public string CssClass { get; set; }

        [Browsable(false)]
        public string SfFieldType { get; set; }

        [Browsable(false)]
        public string SfFieldName { get; set; }
    }
}
