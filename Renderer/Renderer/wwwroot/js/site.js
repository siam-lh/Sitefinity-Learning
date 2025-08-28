document.addEventListener('DOMContentLoaded', function () {

    //const checkboxShippingAddressSameAsBilling = document.querySelector('input[name="shipToCompanySameAsBillTo"]');
    //const checkboxCustomerTechnicalContactSameAsPrimary = document.querySelector('input[name="customerTechnicalContactSameAsPrimary"]');

    //const backBtn = document.getElementById("backBtn");
    //const continueBtn = document.getElementById("continueBtn");
    //const submitBtn = document.getElementById("submitBtn");

    //const section2 = document.querySelector('.products_form form [data-sf-role="fields-container"] > section:nth-of-type(2)');
    //const section3 = document.querySelector('.products_form form [data-sf-role="fields-container"] > section:nth-of-type(3)');

    //// CONFIGURATION CONSTANTS

    //const BILL_TO_IDS = [
    //    'billToCompanyName',
    //    'billToAddress',
    //    'billToCity',
    //    'billToState',
    //    'billToZip'
    //];

    //const SHIP_TO_IDS = [
    //    'shipToCompanyName',
    //    'shipToAddress',
    //    'shipToCity',
    //    'shipToState',
    //    'shipToZip'
    //];

    //const PRIMARY_CONTACT_IDS = [
    //    'customerPrimaryName',
    //    'customerPrimaryEmail',
    //    'customerPrimaryPhone'
    //];

    //const TECHNICAL_CONTACT_IDS = [
    //    'customerTechnicalName',
    //    'customerTechnicalEmail',
    //    'customerTechnicalPhone'
    //];

    //// STEP NAVIGATION LOGIC

    //let complaintFormStep = 1;
    //let formSubmissionAllowed = false; 

    //function initializeStepNavigation() {
    //    section2.style.display = "block";
    //    section3.style.display = "none";
    //    backBtn.style.display = "none";
    //    submitBtn.style.display = "none";
    //    updateProgressBar();
    //}

    //function handleContinueClick() {
    //    if (complaintFormStep === 1) {
    //        var allInputs = section2.querySelectorAll('input, textarea, select');

    //        var visibleInputs = Array.from(allInputs).filter(input => {
    //            return input.offsetParent !== null;
    //        });

    //        var valid = true;

    //        visibleInputs.forEach(function (input) {
    //            if (!input.checkValidity()) {
    //                input.classList.add('is-invalid');
    //                input.reportValidity();
    //                valid = false;
    //            }
    //        });
            
    //        if (!valid) return;

    //        section2.style.display = "none";
    //        section3.style.display = "block";
    //        backBtn.style.display = "inline-block";
    //        complaintFormStep = 2;
    //        updateProgressBar();
    //    } else if (complaintFormStep === 2) {
    //        var allInputs = section3.querySelectorAll('input, textarea, select');

    //        var visibleInputs = Array.from(allInputs).filter(input => {
    //            return input.offsetParent !== null;
    //        });

    //        var valid = true;

    //        visibleInputs.forEach(function (input) {
    //            if (!input.checkValidity()) {
    //                input.reportValidity();
    //                valid = false;
    //            }
    //        });

    //        if (!valid) return;
           
    //        section2.style.display = "block";
    //        section3.style.display = "block";

    //        if (section2) {
    //            const previewOption = section2.querySelectorAll(".complaintFormPreview");
    //            previewOption.forEach((el, idx) => {
    //                el.style.display = "none"; 
    //            });
    //            // For all product-info-item fields: hide input, show span
    //            const productItems = document.querySelectorAll('.product-info-item');
    //            productItems.forEach(item => {
    //                const wrappers = item.querySelectorAll('.input-wrapper');
    //                wrappers.forEach(wrapper => {
    //                    const inputEl = wrapper.querySelector('input, textarea, select');
    //                    const spanEl = wrapper.querySelector('.input-preview');
    //                    if (inputEl && spanEl) {
    //                        spanEl.textContent = inputEl.value;  // copy value
    //                        spanEl.style.display = 'inline';     // show span
    //                        inputEl.style.display = 'none';      // hide input
    //                    }
    //                });
    //            });
    //        }
    //        continueBtn.style.display = "none";
    //        submitBtn.style.display = "inline-block";
            
    //        complaintFormStep = 3;
    //        updateProgressBar();
    //        makeFieldsReadOnly();
    //    }
    //}

    //function handleBackClick() {
    //    if (complaintFormStep === 2) {
    //        section2.style.display = "block";
    //        section3.style.display = "none";
    //        backBtn.style.display = "none";
    //        complaintFormStep = 1;
    //        if (section2) {
    //            const previewOption = section2.querySelectorAll(".complaintFormPreview");
    //            previewOption.forEach((el, idx) => {
    //                el.style.display = "block";
    //            });
    //        }
    //    } else if (complaintFormStep === 3) {
    //        section2.style.display = "none";
    //        section3.style.display = "block";
    //        continueBtn.style.display = "inline-block";
    //        submitBtn.style.display = "none";
    //        complaintFormStep = 2;

    //        makeFieldsEditable();
    //    }
    //}

    //function makeFieldsReadOnly() {
    //    // Text inputs and textarea
    //    const inputFields = document.querySelectorAll('.products_form input:not([type="checkbox"]):not([type="radio"]):not([type="file"]), .products_form textarea');
    //    inputFields.forEach(field => {
    //        field.readOnly = true;
    //    });

    //    // Select, checkboxes, radios, and file inputs
    //    const interactiveFields = document.querySelectorAll('.products_form select, .products_form input[type="checkbox"], .products_form input[type="radio"], .products_form input[type="file"]');
    //    interactiveFields.forEach(field => {
    //        // Save required state
    //        if (field.required) {
    //            field.dataset.required = "true";
    //            field.required = false;
    //        }

    //        field.style.pointerEvents = 'none';
    //        field.style.opacity = '0.6';
    //        field.setAttribute('tabindex', '-1');

    //        // Save original styles
    //        field.dataset.originalPointerEvents = field.style.pointerEvents || '';
    //        field.dataset.originalOpacity = field.style.opacity || '';
    //        field.dataset.originalTabindex = field.getAttribute('tabindex') || '';
    //    });
    //}

    //function makeFieldsEditable() {
    //    // Text inputs and textarea
    //    const inputFields = document.querySelectorAll('.products_form input:not([type="checkbox"]):not([type="radio"]):not([type="file"]), .products_form textarea');
    //    inputFields.forEach(field => {
    //        field.readOnly = false;
    //    });

    //    // Select, checkboxes, radios, and file inputs
    //    const interactiveFields = document.querySelectorAll('.products_form select, .products_form input[type="checkbox"], .products_form input[type="radio"], .products_form input[type="file"]');
    //    interactiveFields.forEach(field => {
    //        field.style.pointerEvents = field.dataset.originalPointerEvents || '';
    //        field.style.opacity = field.dataset.originalOpacity || '';

    //        if (field.dataset.originalTabindex) {
    //            field.setAttribute('tabindex', field.dataset.originalTabindex);
    //        } else {
    //            field.removeAttribute('tabindex');
    //        }

    //        if (field.dataset.required === "true") {
    //            field.required = true;
    //        }
    //    });
    //}

    //function updateProgressBar() {
    //    const steps = document.querySelectorAll(".step");
    //    const progress = document.getElementById("progress");

    //    steps.forEach((step, index) => {
    //        step.classList.remove("active", "completed");
    //        if (index < complaintFormStep - 1) {
    //            step.classList.add("completed");
    //        } else if (index === complaintFormStep - 1) {
    //            step.classList.add("active");
    //        }
    //    });

    //    progress.style.width = ((complaintFormStep - 1) / (steps.length - 1)) * 100 + "%";
    //}

    //function syncFormFields(sourceIds, targetIds, isChecked) {
    //    sourceIds.forEach((sourceId, index) => {
    //        const sourceField = document.getElementById(sourceId);
    //        const targetField = document.getElementById(targetIds[index]);

    //        if (sourceField && targetField && isChecked) {
    //            targetField.value = isChecked ? sourceField.value : '';
    //            //targetField.disabled = isChecked;
    //        }
    //    });
    //}

    //function syncCountryFields(isChecked) {
    //    const billToCountry = document.querySelector('select[name="billToBillingCountry"]');
    //    const shipToCountry = document.querySelector('select[name="shipToCountry"]');

    //    if (billToCountry && shipToCountry) {
    //        if (isChecked) {
    //            shipToCountry.value = billToCountry.value;
    //            //shipToCountry.disabled = true;
    //        } else {
    //            shipToCountry.value = 'USA';
    //            //shipToCountry.disabled = false;
    //        }
    //    }
    //}

    //function handleShippingAddressSync(event) {
    //    const isChecked = event.target.checked;
    //    console.log('Shipping address checkbox state changed. Checked:', isChecked);

    //    // Sync billing and shipping address fields
    //    syncFormFields(BILL_TO_IDS, SHIP_TO_IDS, isChecked);

    //    // Sync country fields
    //    syncCountryFields(isChecked);
    //}

    //function handleTechnicalContactSync(event) {
    //    const isChecked = event.target.checked;
    //    // Sync primary and technical contact fields
    //    syncFormFields(PRIMARY_CONTACT_IDS, TECHNICAL_CONTACT_IDS, isChecked);
    //}

 
    //// EVENT LISTENER SETUP

    //function setupEventListeners() {
    //    // Shipping address synchronization
    //    if (checkboxShippingAddressSameAsBilling) {
    //        checkboxShippingAddressSameAsBilling.addEventListener('change', handleShippingAddressSync);
    //    } else {
    //        console.warn('Shipping address checkbox element not found');
    //        return;
    //    }

    //    // Technical contact synchronization
    //    if (checkboxCustomerTechnicalContactSameAsPrimary) {
    //        checkboxCustomerTechnicalContactSameAsPrimary.addEventListener('change', handleTechnicalContactSync);
    //    } else {
    //        console.warn('Technical contact checkbox element not found');
    //        return;
    //    }

    //    // Step navigation
    //    continueBtn.addEventListener("click", handleContinueClick);
    //    backBtn.addEventListener("click", handleBackClick);

    //}

    //// INITIALIZATION
    //initializeStepNavigation();
    //setupEventListeners();
});

