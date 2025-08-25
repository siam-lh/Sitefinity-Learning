using System.Security.Cryptography.Xml;

namespace Renderer.ViewModels
{
    public class ProductInfoViewModel
    {
        public int Index { get; set; }

        // Spellman Serial Number 
        public string SpellmanSerialNumberFieldName { get; set; }
        public string SpellmanSerialNumberLabel { get; set; } = "Spellman Serial Number";
        public string SpellmanSerialNumberValidationAttributes { get; set; }
        public string SpellmanSerialNumberValue { get; set; }

        // Spellman Part Number 
        public string SpellmanPartNumberFieldName { get; set; }
        public string SpellmanPartNumberLabel { get; set; } = "Spellman Part Number";
        public string SpellmanPartNumberValidationAttributes { get; set; }
        public string SpellmanPartNumberValue { get; set; }

        // Spellman Part Number 
        public string RepairPO_ReferenceNumberFieldName { get; set; }
        public string RepairPO_ReferenceNumberLabel { get; set; } = "Repair PO/Reference Number";
        public string RepairPO_ReferenceNumberValidationAttributes { get; set; }
        public string RepairPO_ReferenceNumberValue { get; set; }

        // Failure/Problem/Error 
        public string FailureProblemErrorFieldName { get; set; }
        public string FailureProblemErrorLabel { get; set; } = "Failure/Problem/Error";
        public string FailureProblemErrorValidationAttributes { get; set; }
        public string FailureProblemErrorValue { get; set; }

        // Additional Equipment 
        public string AdditionalEquipmentFieldName { get; set; }
        public string AdditionalEquipmentLabel { get; set; } = "Additional Equipment";
        public string AdditionalEquipmentValidationAttributes { get; set; }
        public string AdditionalEquipmentValue { get; set; }

        // Installation Country
        public string InstallationCountryFieldName { get; set; }
        public string InstallationCountryLabel { get; set; } = "Installation Country";
        public string InstallationCountryValidationAttributes { get; set; }
        public string InstallationCountryValue { get; set; }
    }
}

