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
                label: 'Spellman Serial Number',
                type: 'input',
                placeholder: 'Enter serial number',
                required: true,
                cssClass: 'spellman-serial-field'
            },
            {
                key: 'spellmanPartNumber',
                label: 'Spellman Part Number',
                type: 'input',
                placeholder: 'Enter part number',
                required: false,
                cssClass: 'spellman-part-field'
            },
            {
                key: 'failureProblemError',
                label: 'Failure/Problem/Error',
                type: 'textarea',
                placeholder: 'Describe the failure, problem, or error',
                required: true,
                rows: 3,
                cssClass: 'failure-problem-field'
            },

            {
                key: 'repairPO_ReferenceNumber',
                label: 'Repair PO/Reference Number',
                type: 'input',
                placeholder: 'Repair PO/Reference Number',
                required: false,
                cssClass: 'repair-po_reference-field'
            },

            {
                key: 'additionalEquipment',
                label: 'Additional Equipment',
                rows: 3,
                placeholder: 'Additional Equipment',
                required: false,
                cssClass: 'additional-equipment-field'
            },

            {
                key: 'installationCountry',
                label: 'Installation Country',
                placeholder: 'Installation Country',
                required: false,
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

            // Only include products that have at least one field filled
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
