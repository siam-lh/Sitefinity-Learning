class ProductCompositeWidget {
    constructor(container) {
        this.container = container;
        this.compositeField = document.getElementById(container.dataset.compositeId);
        this.productInfoContainer = container.querySelector('#product-info-container');
        this.addProductBtn = container.querySelector('#add-product-btn');
        this.template = container.querySelector('#product-item-template');
        this.fieldName = container.dataset.fieldName;

        // Define field configuration
        this.fieldConfig = [
            {
                key: 'spellmanSerialNumber',
                cssClass: 'spellman-serial-field'
            },
            {
                key: 'spellmanPartNumber',
                cssClass: 'spellman-part-field'
            },
            {
                key: 'repairPO_ReferenceNumber',
                cssClass: 'repair-po_reference-field'
            },
            {
                key: 'failureProblemError',
                cssClass: 'failure-problem-field'
            },

            {
                key: 'additionalEquipment',
                cssClass: 'additional-equipment-field'
            },

            {
                key: 'installationCountry',
                cssClass: 'installation-country-field'
            },
        ];

        // Load validation messages
        this.validationMessages = this.loadValidationMessages();

        this.productCount = this.getProductItems().length;
       
        this.init();
    }

    init() {
        if (!this.compositeField || !this.productInfoContainer) return;

        this.attachEventListeners();
        this.updateProductNumbers();
        this.updateCompositeValue();
    }

    loadValidationMessages() {
        try {
            const validationScript = document.getElementById(`${this.fieldName}_ValidationMessages`);
            return validationScript ? JSON.parse(validationScript.textContent) : {};
        } catch (e) {
            console.warn('Could not load validation messages:', e);
            return {};
        }
    }

    attachEventListeners() {
        // Add product button
        this.addProductBtn?.addEventListener('click', () => this.addProduct());

        // Event delegation for remove buttons and field changes
        this.productInfoContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-product') || e.target.closest('.remove-product')) {
                const btn = e.target.classList.contains('remove-product') ? e.target : e.target.closest('.remove-product');
                this.removeProduct(btn);
            }
        });

        // Create dynamic field selector for input events
        const fieldSelectors = this.fieldConfig.map(field => `.${field.cssClass}`).join(', ');

        this.productInfoContainer.addEventListener('input', (e) => {
            if (e.target.matches(fieldSelectors)) {
                this.updateCompositeValue();
                this.clearFieldError(e.target);
            }
        });

        this.productInfoContainer.addEventListener('blur', (e) => {
            if (e.target.matches(fieldSelectors)) {
                this.validateField(e.target);
                this.updateCompositeValue();
            }
        }, true);
    }

    addProduct() {
        if (!this.template) return;
        const newItem = this.cloneTemplate();
        this.productInfoContainer.appendChild(newItem);
        this.productCount++;
        this.updateProductNumbers();
        this.updateCompositeValue();

        // Focus on the first field of the new item
        const firstField = newItem.querySelector(`.${this.fieldConfig[0].cssClass}`);
        firstField?.focus();
    }

    cloneTemplate() {
        const templateItem = this.template.querySelector('.product-info-item');
        const newItem = templateItem.cloneNode(true);

        // Update indices and IDs
        newItem.dataset.productIndex = this.productCount;

        // Update all field IDs and names
        this.updateItemFields(newItem, this.productCount);

        // Show remove button
        const removeBtn = newItem.querySelector('.remove-product');
        if (removeBtn) {
            removeBtn.style.display = 'block';
            removeBtn.dataset.index = this.productCount;
        }

        // Clear any template values
        this.fieldConfig.forEach(fieldConfig => {
            const field = newItem.querySelector(`.${fieldConfig.cssClass}`);
            if (field) field.value = '';
        });

        return newItem;
    }

    updateItemFields(item, index) {
        this.fieldConfig.forEach(fieldConfig => {
            const field = item.querySelector(`.${fieldConfig.cssClass}`);
            if (field) {
                field.id = `${this.fieldName}_${fieldConfig.key}_${index}`;
                field.name = `${this.fieldName}_${fieldConfig.key}_${index}`;
                field.dataset.index = index;
                field.dataset.fieldKey = fieldConfig.key;
            }

            // Update labels' for attributes
            const label = item.querySelector(`label[for*="${fieldConfig.key}"]`);
            if (label) {
                label.setAttribute('for', `${this.fieldName}_${fieldConfig.key}_${index}`);
            }

            // Update error message IDs
            const errorElement = item.querySelector(`.${fieldConfig.key}-error`);
            if (errorElement) {
                const newErrorId = `${fieldConfig.key}ErrorMessage_${index}`;
                field.setAttribute('aria-describedby', newErrorId);
                errorElement.id = newErrorId;
            }
        });
    }

    removeProduct(removeBtn) {
        const item = removeBtn.closest('.product-info-item');
        const productItems = this.getProductItems();

        if (item && productItems.length > 1) {
            // Add a fade out animation
            item.style.transition = 'opacity 0.3s ease';
            item.style.opacity = '0';

            setTimeout(() => {
                item.remove();
                this.updateProductNumbers();
                this.updateCompositeValue();
            }, 300);
        }
    }

    updateProductNumbers() {
        const productItems = this.getProductItems();

        productItems.forEach((item, index) => {
            // Update header
            const header = item.querySelector('.product-number');
            if (header) {
                const icon = header.querySelector('i');
                const iconHtml = icon ? icon.outerHTML + ' ' : '';
                header.innerHTML = `${iconHtml}Product ${index + 1}`;
            }

            // Update data attribute
            item.dataset.productIndex = index;

            // Update field indices and IDs
            this.updateItemFields(item, index);

            // Update remove button
            const removeBtn = item.querySelector('.remove-product');
            if (removeBtn) {
                removeBtn.dataset.index = index;
            }
        });

        // Show/hide remove buttons based on count
        this.toggleRemoveButtons(productItems.length > 1);
    }

    toggleRemoveButtons(show) {
        const removeButtons = this.productInfoContainer.querySelectorAll('.remove-product');
        removeButtons.forEach(btn => {
            btn.style.display = show ? 'block' : 'none';
        });
    }

    validateField(field) {
        const fieldKey = field.dataset.fieldKey;
        const fieldConfig = this.fieldConfig.find(config => config.key === fieldKey);

        if (!fieldConfig) return true;

        const isRequired = fieldConfig.required;
        const value = field.value.trim();

        if (isRequired && !value) {
            const errorMessage = this.validationMessages[`${fieldKey}Required`] || `${fieldConfig.label} is required`;
            this.showFieldError(field, errorMessage);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    }

    showFieldError(field, message) {
        field.classList.add('is-invalid');
        const errorContainer = field.nextElementSibling;
        if (errorContainer && errorContainer.classList.contains('invalid-feedback')) {
            errorContainer.textContent = message;
        }
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorContainer = field.nextElementSibling;
        if (errorContainer && errorContainer.classList.contains('invalid-feedback')) {
            errorContainer.textContent = '';
        }
    }

    validateAllFields() {
        const fieldSelectors = this.fieldConfig.map(field => `.${field.cssClass}`).join(', ');
        const fields = this.productInfoContainer.querySelectorAll(fieldSelectors);
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    updateCompositeValue() {
        const products = this.collectProductData();
        if (products.length === 0) {
            this.compositeField.value = '';
            return;
        }

        // Create composite value with all configured fields
        const compositeValue = JSON.stringify(products.map(p => {
            const productData = {};
            this.fieldConfig.forEach(fieldConfig => {
                productData[fieldConfig.key] = p[fieldConfig.key] || '';
            });
            return productData;
        }));

        this.compositeField.value = compositeValue;
        this.compositeField.dispatchEvent(new Event('change', { bubbles: true }));
    }

    collectProductData() {
        const products = [];
        const productItems = this.getProductItems();

        productItems.forEach((item, index) => {
            const productData = { id: index + 1 };
            let hasData = false;

            this.fieldConfig.forEach(fieldConfig => {
                const field = item.querySelector(`.${fieldConfig.cssClass}`);
                if (field) {
                    const value = field.value.trim();
                    productData[fieldConfig.key] = value;
                    if (value) hasData = true;
                }
            });

            if (hasData) {
                products.push(productData);
            }
        });

        return products;
    }

   
    getProductItems() {
        return this.productInfoContainer.querySelectorAll('.product-info-item');
    }

    // Public method for form validation
    isValid() {
        return this.validateAllFields();
    }

    // Helper method to add new field configurations programmatically
    addFieldConfig(fieldConfig) {
        this.fieldConfig.push(fieldConfig);
    }

    // Helper method to get field configuration
    getFieldConfig() {
        return this.fieldConfig;
    }
}

// Initialize widgets when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    const containers = document.querySelectorAll('[data-sf-role="composite-field-container"]');
    containers.forEach(container => {
        const widget = new ProductCompositeWidget(container);
        // Store widget instance for external access
        container._productCompositeWidget = widget;
    });



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
    let formSubmissionAllowed = false;

    function initializeStepNavigation() {
        section2.style.display = "block";
        section3.style.display = "none";
        backBtn.style.display = "none";
        submitBtn.style.display = "none";
        updateProgressBar();
    }

    function handleContinueClick() {
        if (complaintFormStep === 1) {
            var allInputs = section2.querySelectorAll('input, textarea, select');

            var visibleInputs = Array.from(allInputs).filter(input => {
                return input.offsetParent !== null;
            });

            var valid = true;

            visibleInputs.forEach(function (input) {
                if (!input.checkValidity()) {
                    input.classList.add('is-invalid');
                    input.reportValidity();
                    valid = false;
                }
            });

            if (!valid) return;

            section2.style.display = "none";
            section3.style.display = "block";
            backBtn.style.display = "inline-block";
            complaintFormStep = 2;
            updateProgressBar();
        } else if (complaintFormStep === 2) {
            var allInputs = section3.querySelectorAll('input, textarea, select');

            var visibleInputs = Array.from(allInputs).filter(input => {
                return input.offsetParent !== null;
            });

            var valid = true;

            visibleInputs.forEach(function (input) {
                if (!input.checkValidity()) {
                    input.reportValidity();
                    valid = false;
                }
            });

            if (!valid) return;

            section2.style.display = "block";
            section3.style.display = "block";

            if (section2) {
                const previewOption = section2.querySelectorAll(".complaintFormPreview");
                previewOption.forEach((el, idx) => {
                    el.style.display = "none";
                });
                // For all product-info-item fields: hide input, show span
                const productItems = document.querySelectorAll('.product-info-item');
                productItems.forEach(item => {
                    const wrappers = item.querySelectorAll('.input-wrapper');
                    wrappers.forEach(wrapper => {
                        const inputEl = wrapper.querySelector('input, textarea, select');
                        const spanEl = wrapper.querySelector('.input-preview');
                        if (inputEl && spanEl) {
                            spanEl.textContent = inputEl.value;  // copy value
                            spanEl.style.display = 'inline';     // show span
                            inputEl.style.display = 'none';      // hide input
                        }
                    });
                });
            }
            continueBtn.style.display = "none";
            submitBtn.style.display = "inline-block";

            complaintFormStep = 3;
            updateProgressBar();
            makeFieldsReadOnly();
        }
    }

    function handleBackClick() {
        if (complaintFormStep === 2) {
            section2.style.display = "block";
            section3.style.display = "none";
            backBtn.style.display = "none";
            complaintFormStep = 1;
            if (section2) {
                const previewOption = section2.querySelectorAll(".complaintFormPreview");
                previewOption.forEach((el, idx) => {
                    el.style.display = "block";
                });
            }
        } else if (complaintFormStep === 3) {
            section2.style.display = "none";
            section3.style.display = "block";
            continueBtn.style.display = "inline-block";
            submitBtn.style.display = "none";
            complaintFormStep = 2;

            makeFieldsEditable();
        }
    }

    function makeFieldsReadOnly() {
        // Text inputs and textarea
        const inputFields = document.querySelectorAll('.products_form input:not([type="checkbox"]):not([type="radio"]):not([type="file"]), .products_form textarea');
        inputFields.forEach(field => {
            field.readOnly = true;
        });

        // Select, checkboxes, radios, and file inputs
        const interactiveFields = document.querySelectorAll('.products_form select, .products_form input[type="checkbox"], .products_form input[type="radio"], .products_form input[type="file"]');
        interactiveFields.forEach(field => {
            // Save required state
            if (field.required) {
                field.dataset.required = "true";
                field.required = false;
            }

            field.style.pointerEvents = 'none';
            field.style.opacity = '0.6';
            field.setAttribute('tabindex', '-1');

            // Save original styles
            field.dataset.originalPointerEvents = field.style.pointerEvents || '';
            field.dataset.originalOpacity = field.style.opacity || '';
            field.dataset.originalTabindex = field.getAttribute('tabindex') || '';
        });
    }

    function makeFieldsEditable() {
        // Text inputs and textarea
        const inputFields = document.querySelectorAll('.products_form input:not([type="checkbox"]):not([type="radio"]):not([type="file"]), .products_form textarea');
        inputFields.forEach(field => {
            field.readOnly = false;
        });

        // Select, checkboxes, radios, and file inputs
        const interactiveFields = document.querySelectorAll('.products_form select, .products_form input[type="checkbox"], .products_form input[type="radio"], .products_form input[type="file"]');
        interactiveFields.forEach(field => {
            field.style.pointerEvents = field.dataset.originalPointerEvents || '';
            field.style.opacity = field.dataset.originalOpacity || '';

            if (field.dataset.originalTabindex) {
                field.setAttribute('tabindex', field.dataset.originalTabindex);
            } else {
                field.removeAttribute('tabindex');
            }

            if (field.dataset.required === "true") {
                field.required = true;
            }
        });
    }

    function updateProgressBar() {
        const steps = document.querySelectorAll(".step");
        const progress = document.getElementById("progress");

        steps.forEach((step, index) => {
            step.classList.remove("active", "completed");
            if (index < complaintFormStep - 1) {
                step.classList.add("completed");
            } else if (index === complaintFormStep - 1) {
                step.classList.add("active");
            }
        });

        progress.style.width = ((complaintFormStep - 1) / (steps.length - 1)) * 100 + "%";
    }

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

// Global validation hook for Sitefinity forms
if (typeof window.sitefinityFormValidationHooks === 'undefined') {
    window.sitefinityFormValidationHooks = [];
}

window.sitefinityFormValidationHooks.push(function (form) {
    const containers = form.querySelectorAll('[data-sf-role="composite-field-container"]');
    let isFormValid = true;
    containers.forEach(container => {
        const widget = container._productCompositeWidget;
        if (widget && !widget.isValid()) {
            isFormValid = false;
        }
    });

    return isFormValid;
});
