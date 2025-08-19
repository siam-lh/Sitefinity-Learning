
//document.addEventListener('DOMContentLoaded', function () {
//    var compositeField = document.getElementById('@compositeFieldUniqueId');
//    var productTitleField = document.getElementById('@productTitleUniqueId');
//    var productDescriptionField = document.getElementById('@productDescriptionUniqueId');

//    function updateCompositeValue() {
//        var titleValue = productTitleField.value || '';
//        var descriptionValue = productDescriptionField.value || '';

//        // Create a JSON representation or concatenated value
//        var compositeValue = JSON.stringify({
//            ProductTitle: titleValue,
//            ProductDescription: descriptionValue
//        });

//        compositeField.value = compositeValue;

//        // Trigger change event to notify Sitefinity
//        var event = new Event('change', { bubbles: true });
//        compositeField.dispatchEvent(event);
//    }

//    // Update composite value when sub-fields change
//    productTitleField.addEventListener('input', updateCompositeValue);
//    productTitleField.addEventListener('blur', updateCompositeValue);
//    productDescriptionField.addEventListener('input', updateCompositeValue);
//    productDescriptionField.addEventListener('blur', updateCompositeValue);

//    // Initialize composite value
//    updateCompositeValue();
//});



document.addEventListener('DOMContentLoaded', function () {
    var container = document.querySelector('[data-sf-role="composite-field-container"]');
    if (!container) return;

    var compositeField = document.getElementById(container.dataset.compositeId);
    var productTitleField = document.getElementById(container.dataset.titleId);
    var productDescriptionField = document.getElementById(container.dataset.descriptionId);

    if (!compositeField || !productTitleField || !productDescriptionField) return;

    function updateCompositeValue() {
        var compositeValue = JSON.stringify({
            ProductTitle: productTitleField.value || '',
            ProductDescription: productDescriptionField.value || ''
        });

        compositeField.value = compositeValue;
        compositeField.dispatchEvent(new Event('change', { bubbles: true }));
    }

    productTitleField.addEventListener('input', updateCompositeValue);
    productTitleField.addEventListener('blur', updateCompositeValue);
    productDescriptionField.addEventListener('input', updateCompositeValue);
    productDescriptionField.addEventListener('blur', updateCompositeValue);

    updateCompositeValue();
});

