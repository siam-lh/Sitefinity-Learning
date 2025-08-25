document.addEventListener('DOMContentLoaded', function () {

    const checkboxShippingAddressSameAsBilling = document.querySelector('input[name="shipToCompanySameAsBillTo"]');
    const checkboxCustomerTechnicalContactSameAsPrimary = document.querySelector('input[name="customerTechnicalContactSameAsPrimary"]');

    const backBtn = document.getElementById("backBtn");
    const continueBtn = document.getElementById("continueBtn");
    const submitBtn = document.getElementById("submitBtn");

    const section2 = document.querySelector('.products_form form [data-sf-role="fields-container"] > section:nth-of-type(2)');
    const section3 = document.querySelector('.products_form form [data-sf-role="fields-container"] > section:nth-of-type(3)');

    // CONFIGURATION CONSTANTS

    const BILL_TO_IDS = [
        'billToCompanyName',
        'billToAddress',
        'billToCity',
        'billToState',
        'billToZip'
    ];

    const SHIP_TO_IDS = [
        'shipToCompanyName',
        'shipToAddress',
        'shipToCity',
        'shipToState',
        'shipToZip'
    ];

    const PRIMARY_CONTACT_IDS = [
        'customerPrimaryName',
        'customerPrimaryEmail',
        'customerPrimaryPhone'
    ];

    const TECHNICAL_CONTACT_IDS = [
        'customerTechnicalName',
        'customerTechnicalEmail',
        'customerTechnicalPhone'
    ];

    // STEP NAVIGATION LOGIC

    let complaintFormStep = 1;

    function initializeStepNavigation() {
        section2.style.display = "block";
        section3.style.display = "none";
        backBtn.style.display = "none";
        submitBtn.style.display = "none";
    }
    function makeFieldsReadOnly() {
        const inputFields = document.querySelectorAll('.products_form input:not([type="checkbox"]):not([type="radio"]), .products_form textarea');
        inputFields.forEach(field => {
            field.readOnly = true;
        });

        const selectAndCheckboxes = document.querySelectorAll('.products_form select, .products_form input[type="checkbox"], .products_form input[type="radio"]');
        selectAndCheckboxes.forEach(field => {
            // Save required state
            if (field.required) {
                field.dataset.required = "true";
                field.required = false;
            }
            field.disabled = true;
        });
    }

    function makeFieldsEditable() {
        const inputFields = document.querySelectorAll('.products_form input:not([type="checkbox"]):not([type="radio"]), .products_form textarea');
        inputFields.forEach(field => {
            field.readOnly = false;
        });

        const selectAndCheckboxes = document.querySelectorAll('.products_form select, .products_form input[type="checkbox"], .products_form input[type="radio"]');
        selectAndCheckboxes.forEach(field => {
            field.disabled = false;
            // Restore required if it was originally required
            if (field.dataset.required === "true") {
                field.required = true;
            }
        });
    }


    function handleContinueClick() {
        if (complaintFormStep === 1) {
            section2.style.display = "none";
            section3.style.display = "block";
            backBtn.style.display = "inline-block";
            complaintFormStep = 2;

        } else if (complaintFormStep === 2) {
            section2.style.display = "block";
            section3.style.display = "block";
            continueBtn.style.display = "none";
            submitBtn.style.display = "inline-block";
            complaintFormStep = 3;

            // Make fields read-only / disabled safely
            //makeFieldsReadOnly();
        }
    }

    function handleBackClick() {
        if (complaintFormStep === 2) {
            section2.style.display = "block";
            section3.style.display = "none";
            backBtn.style.display = "none";
            complaintFormStep = 1;

        } else if (complaintFormStep === 3) {
            section2.style.display = "none";
            section3.style.display = "block";
            continueBtn.style.display = "inline-block";
            submitBtn.style.display = "none";
            complaintFormStep = 2;

            // Make fields editable again
            //makeFieldsEditable();
        }
    }


    //function handleContinueClick() {
    //    if (complaintFormStep === 1) {
    //        // Go to complaintFormStep 2
    //        section2.style.display = "none";
    //        section3.style.display = "block";
    //        backBtn.style.display = "inline-block";
    //        complaintFormStep = 2;



    //    } else if (complaintFormStep === 2) {
    //        // Go to complaintFormStep 3
    //        section2.style.display = "block";
    //        section3.style.display = "block";
    //        continueBtn.style.display = "none";
    //        submitBtn.style.display = "inline-block";
    //        complaintFormStep = 3;
    //        const allFields = document.querySelectorAll('.products_form input, .products_form textarea, .products_form select');
    //        allFields.forEach(field => {
    //            field.disabled = true;
    //        });
    //    }
    //}

    //function handleBackClick() {
    //    if (complaintFormStep === 2) {
    //        // Back to complaintFormStep 1
    //        section2.style.display = "block";
    //        section3.style.display = "none";
    //        backBtn.style.display = "none";
    //        complaintFormStep = 1;
    //    } else if (complaintFormStep === 3) {
    //        // Back to complaintFormStep 2
    //        section2.style.display = "none";
    //        section3.style.display = "block";
    //        continueBtn.style.display = "inline-block";
    //        submitBtn.style.display = "none";
    //        complaintFormStep = 2;
    //        const allFields = document.querySelectorAll('.products_form input, .products_form textarea, .products_form select');
    //        allFields.forEach(field => {
    //            field.disabled = false;
    //        });
    //    }
    //}

    // FORM FIELD SYNCHRONIZATION LOGIC

    function syncFormFields(sourceIds, targetIds, isChecked) {
        sourceIds.forEach((sourceId, index) => {
            const sourceField = document.getElementById(sourceId);
            const targetField = document.getElementById(targetIds[index]);

            if (sourceField && targetField && isChecked) {
                targetField.value = isChecked ? sourceField.value : '';
                //targetField.disabled = isChecked;
            }
        });
    }

    function syncCountryFields(isChecked) {
        const billToCountry = document.querySelector('select[name="billToBillingCountry"]');
        const shipToCountry = document.querySelector('select[name="shipToCountry"]');

        if (billToCountry && shipToCountry) {
            if (isChecked) {
                shipToCountry.value = billToCountry.value;
                //shipToCountry.disabled = true;
            } else {
                shipToCountry.value = 'USA';
                //shipToCountry.disabled = false;
            }
        }
    }

    function handleShippingAddressSync(event) {
        const isChecked = event.target.checked;
        console.log('Shipping address checkbox state changed. Checked:', isChecked);

        // Sync billing and shipping address fields
        syncFormFields(BILL_TO_IDS, SHIP_TO_IDS, isChecked);

        // Sync country fields
        syncCountryFields(isChecked);
    }

    function handleTechnicalContactSync(event) {
        const isChecked = event.target.checked;
        // Sync primary and technical contact fields
        syncFormFields(PRIMARY_CONTACT_IDS, TECHNICAL_CONTACT_IDS, isChecked);
    }

    // EVENT LISTENER SETUP

    function setupEventListeners() {
        // Shipping address synchronization
        if (checkboxShippingAddressSameAsBilling) {
            checkboxShippingAddressSameAsBilling.addEventListener('change', handleShippingAddressSync);
        } else {
            console.warn('Shipping address checkbox element not found');
            return;
        }

        // Technical contact synchronization
        if (checkboxCustomerTechnicalContactSameAsPrimary) {
            checkboxCustomerTechnicalContactSameAsPrimary.addEventListener('change', handleTechnicalContactSync);
        } else {
            console.warn('Technical contact checkbox element not found');
            return;
        }

        // Step navigation
        continueBtn.addEventListener("click", handleContinueClick);
        backBtn.addEventListener("click", handleBackClick);
    }

    // INITIALIZATION
    initializeStepNavigation();
    setupEventListeners();
});



//document.addEventListener('DOMContentLoaded', function () {
//    const checkboxShippingAddressSameAsBilling = document.querySelector('input[name="shipToCompanySameAsBillTo"]');
//    const checkboxCustomerTechnicalContactSameAsPrimary = document.querySelector('input[name="customerTechnicalContactSameAsPrimary"]');
//    if (!checkboxShippingAddressSameAsBilling) {
//        console.warn('Checkbox element not found');
//        return;
//    }

//    checkboxShippingAddressSameAsBilling.addEventListener('change', function (event) {
//        const isChecked = event.target.checked;
//        console.log('Checkbox state changed. Checked:', isChecked);

//        // List of Bill To input field ids
//        const billToIds = [
//            'billToCompanyName',
//            'billToAddress',
//            'billToCity',
//            'billToState',
//            'billToZip'
//        ];

//        // Corresponding Ship To input field ids
//        const shipToIds = [
//            'shipToCompanyName',
//            'shipToAddress',
//            'shipToCity',
//            'shipToState',
//            'shipToZip'
//        ];

//        // Copy values or clear depending on checkboxShippingAddressSameAsBilling state
//        billToIds.forEach((billToId, index) => {
//            const billToField = document.getElementById(billToId);
//            const shipToField = document.getElementById(shipToIds[index]);
//            if (billToField && shipToField) {
//                shipToField.value = isChecked ? billToField.value : '';
//                //shipToField.disabled = isChecked; 
//            }
//        });

//        // Handle select elements by name for billing and shipping countries
//        const billToCountry = document.querySelector('select[name="billToBillingCountry"]');
//        const shipToCountry = document.querySelector('select[name="shipToCountry"]');
//        if (billToCountry && shipToCountry) {
//            if (isChecked) {
//                shipToCountry.value = billToCountry.value;
//                //shipToCountry.disabled = true;
//            } else {
//                shipToCountry.value = 'USA';
//                //shipToCountry.disabled = false;
//            }
//        }
//    });

//    if (!checkboxCustomerTechnicalContactSameAsPrimary) {
//        console.warn('Checkbox element not found');
//        return;
//    }

//    checkboxCustomerTechnicalContactSameAsPrimary.addEventListener('change', function (event) {
//        const isChecked = event.target.checked;
//        console.log('Checkbox state changed. Checked:', isChecked);

//        // List of Primary Contact input field ids
//        const primaryContactIds = [
//            'customerPrimaryName',
//            'customerPrimaryEmail',
//            'customerPrimaryPhone'
//        ];

//        // List of Technical Contact input field ids
//        const technicalContactIds = [
//            'customerTechnicalName',
//            'customerTechnicalEmail',
//            'customerTechnicalPhone',
//        ];

//        primaryContactIds.forEach((primaryContactId, index) => {
//            const primaryContactField = document.getElementById(primaryContactId);
//            const technicalContactField = document.getElementById(technicalContactIds[index]);
//            if (primaryContactField && technicalContactField) {
//                technicalContactField.value = isChecked ? primaryContactField.value : '';
//                //technicalContactField.disabled = isChecked;
//            }
//        });

       
//    });

//    const backBtn = document.getElementById("backBtn");
//    const continueBtn = document.getElementById("continueBtn");
//    const submitBtn = document.getElementById("submitBtn");

//    const section2 = document.querySelector('.products_form form [data-sf-role="fields-container"] > section:nth-of-type(2)');
//    const section3 = document.querySelector('.products_form form [data-sf-role="fields-container"] > section:nth-of-type(3)');

//    let complaintFormStep = 1; 

//    // Initial state
//    section2.style.display = "block";
//    section3.style.display = "none";
//    backBtn.style.display = "none";
//    submitBtn.style.display = "none";

//    continueBtn.addEventListener("click", function () {
//        if (complaintFormStep === 1) {
//            // Go to complaintFormStep 2
//            section2.style.display = "none";
//            section3.style.display = "block";
//            backBtn.style.display = "inline-block";
//            complaintFormStep = 2;
//        } else if (complaintFormStep === 2) {
//            // Go to complaintFormStep 3
//            section2.style.display = "block";
//            section3.style.display = "block";
//            continueBtn.style.display = "none";
//            submitBtn.style.display = "inline-block";
//            complaintFormStep = 3;
//        }
//    });

//    backBtn.addEventListener("click", function () {
//        if (complaintFormStep === 2) {
//            // Back to complaintFormStep 1
//            section2.style.display = "block";
//            section3.style.display = "none";
//            backBtn.style.display = "none";
//            complaintFormStep = 1;
//        } else if (complaintFormStep === 3) {
//            // Back to complaintFormStep 2
//            section2.style.display = "none";
//            section3.style.display = "block";
//            continueBtn.style.display = "inline-block";
//            submitBtn.style.display = "none";
//            complaintFormStep = 2;
//        }
//    });

//});


