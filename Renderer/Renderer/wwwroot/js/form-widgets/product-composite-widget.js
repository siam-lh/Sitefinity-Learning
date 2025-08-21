class ProductCompositeWidget {
    constructor(container) {
        this.container = container;
        this.compositeField = document.getElementById(container.dataset.compositeId);
        this.productInfoContainer = container.querySelector('#product-info-container');
        this.addProductBtn = container.querySelector('#add-product-btn');
        this.template = container.querySelector('#product-item-template');
        this.fieldName = container.dataset.fieldName;

        // Load validation messages
        this.validationMessages = this.loadValidationMessages();

        this.productCount = this.getProductItems().length;
        console.log("Container ", this.container )
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

        this.productInfoContainer.addEventListener('input', (e) => {
            if (e.target.matches('.product-title-field, .product-description-field')) {
                this.updateCompositeValue();
                this.clearFieldError(e.target);
            }
        });

        this.productInfoContainer.addEventListener('blur', (e) => {
            if (e.target.matches('.product-title-field, .product-description-field')) {
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
        const firstField = newItem.querySelector('.product-title-field');
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
        const titleField = newItem.querySelector('.product-title-field');
        const descriptionField = newItem.querySelector('.product-description-field');
        if (titleField) titleField.value = '';
        if (descriptionField) descriptionField.value = '';

        return newItem;
    }

    updateItemFields(item, index) {
        const titleField = item.querySelector('.product-title-field');
        const descriptionField = item.querySelector('.product-description-field');

        if (titleField) {
            titleField.id = `${this.fieldName}_ProductTitle_${index}`;
            titleField.name = `${this.fieldName}_ProductTitle_${index}`;
            titleField.dataset.index = index;
        }

        if (descriptionField) {
            descriptionField.id = `${this.fieldName}_ProductDescription_${index}`;
            descriptionField.name = `${this.fieldName}_ProductDescription_${index}`;
            descriptionField.dataset.index = index;
        }

        // Update labels' for attributes
        const titleLabel = item.querySelector('label[for*="ProductTitle"]');
        const descriptionLabel = item.querySelector('label[for*="ProductDescription"]');

        if (titleLabel) {
            titleLabel.setAttribute('for', `${this.fieldName}_ProductTitle_${index}`);
        }

        if (descriptionLabel) {
            descriptionLabel.setAttribute('for', `${this.fieldName}_ProductDescription_${index}`);
        }

        // Update error message IDs
        const titleError = item.querySelector('.product-title-field').getAttribute('aria-describedby');
        const descriptionError = item.querySelector('.product-description-field').getAttribute('aria-describedby');

        if (titleError) {
            const newTitleErrorId = `ProductTitleErrorMessage_${index}`;
            item.querySelector('.product-title-field').setAttribute('aria-describedby', newTitleErrorId);
            item.querySelector('.product-title-field').nextElementSibling.id = newTitleErrorId;
        }

        if (descriptionError) {
            const newDescriptionErrorId = `ProductDescriptionErrorMessage_${index}`;
            item.querySelector('.product-description-field').setAttribute('aria-describedby', newDescriptionErrorId);
            item.querySelector('.product-description-field').nextElementSibling.id = newDescriptionErrorId;
        }
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
        const isRequired = field.hasAttribute('required');
        const value = field.value.trim();
        const errorContainer = field.nextElementSibling;

        if (isRequired && !value) {
            const fieldType = field.dataset.fieldType;
            const errorMessage = fieldType === 'title'
                ? this.validationMessages.productTitleRequired || 'Spellman Serial Number is required'
                : this.validationMessages.productDescriptionRequired || 'Failure/Problem/Error is required';

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
        const fields = this.productInfoContainer.querySelectorAll('.product-title-field, .product-description-field');
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

        // Simple format - just title and description
        const compositeValue = JSON.stringify(products.map(p => ({
            ProductTitle: p.title,
            ProductDescription: p.description
        })));
                // Option 2: Enhanced format with metadata (uncomment to use)
                // var compositeValue = JSON.stringify({
                //     items: products,
                //     count: products.length,
                //     lastUpdated: new Date().toISOString()
                // });

                // Option 3: Simple enhanced format (uncomment to use)
                // var compositeValue = JSON.stringify(products.map(function(p) {
                //     return {
                //         id: p.id,
                //         title: p.title,
                //         description: p.description
                //     };
                // }));
        this.compositeField.value = compositeValue;
        this.compositeField.dispatchEvent(new Event('change', { bubbles: true }));
    }

    collectProductData() {
        const products = [];
        const productItems = this.getProductItems();

        productItems.forEach((item, index) => {
            const titleField = item.querySelector('.product-title-field');
            const descriptionField = item.querySelector('.product-description-field');

            if (titleField && descriptionField) {
                const title = titleField.value.trim();
                const description = descriptionField.value.trim();

                // Only include products that have at least one field filled
                if (title || description) {
                    products.push({
                        id: index + 1,
                        title: title,
                        description: description
                    });
                }
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