
document.addEventListener('DOMContentLoaded', function () {
    var container = document.querySelector('[data-sf-role="composite-field-container"]');
    if (!container) return;

    var compositeField = document.getElementById(container.dataset.compositeId);
    var productInfoContainer = document.getElementById('product-info-container');
    var addProductBtn = document.getElementById('add-product-btn');

    if (!compositeField || !productInfoContainer) return;

    var productCount = parseInt(container.dataset.productCount) || 1;
    function updateCompositeValue() {
        var products = [];
        var productItems = productInfoContainer.querySelectorAll('.product-info-item');

        productItems.forEach(function (item, index) {
            var titleField = item.querySelector('.product-title-field');
            var descriptionField = item.querySelector('.product-description-field');

            if (titleField && descriptionField && (titleField.value || descriptionField.value)) {
                products.push({
                    id: index + 1,
                    title: titleField.value,
                    description: descriptionField.value,
                    created: new Date().toISOString(),
                    isValid: !!(titleField.value && descriptionField.value)
                });
            }
        });

        if (products.length === 0) {
            return;
        }

        var compositeValue = JSON.stringify(products.map(function (p) {
            return {
                ProductTitle: p.title,
                ProductDescription: p.description
            };
        }));
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
        compositeField.value = compositeValue;
        compositeField.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function attachFieldListeners(item) {
        var titleField = item.querySelector('.product-title-field');
        var descriptionField = item.querySelector('.product-description-field');

        if (titleField) {
            titleField.addEventListener('input', updateCompositeValue);
            titleField.addEventListener('blur', updateCompositeValue);
        }

        if (descriptionField) {
            descriptionField.addEventListener('input', updateCompositeValue);
            descriptionField.addEventListener('blur', updateCompositeValue);
        }
    }

    function updateProductNumbers() {
        var productItems = productInfoContainer.querySelectorAll('.product-info-item');
        productItems.forEach(function (item, index) {
            var header = item.querySelector('h6');
            if (header) {
                header.textContent = 'Product ' + (index + 1);
            }
            item.dataset.productIndex = index;

            // Update field indices
            var titleField = item.querySelector('.product-title-field');
            var descriptionField = item.querySelector('.product-description-field');

            if (titleField) {
                titleField.dataset.index = index;
                titleField.id = titleField.id.replace(/_\d+$/, '_' + index);
            }

            if (descriptionField) {
                descriptionField.dataset.index = index;
                descriptionField.id = descriptionField.id.replace(/_\d+$/, '_' + index);
            }
        });

        // Show/hide remove buttons
        var removeButtons = productInfoContainer.querySelectorAll('.remove-product');
        removeButtons.forEach(function (btn) {
            btn.style.display = productItems.length > 1 ? 'block' : 'none';
        });
    }

    function createProductItem(index) {
        var template = `
            <div class="product-info-item border p-3 mb-3" data-product-index="${index}">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">Product ${index + 1}</h6>
                    <button type="button" class="btn btn-sm btn-outline-danger remove-product" data-index="${index}">Remove</button>
                </div>
                
                <div class="mb-3">
                    <label for="${compositeField.name}_ProductTitle_${index}" class="form-label">Product Title</label>
                    <input id="${compositeField.name}_ProductTitle_${index}" 
                           type="text" 
                           class="form-control product-title-field"
                           data-index="${index}" />
                    <div class="invalid-feedback"></div>
                </div>
                
                <div class="mb-3">
                    <label for="${compositeField.name}_ProductDescription_${index}" class="form-label">Product Description</label>
                    <textarea id="${compositeField.name}_ProductDescription_${index}" 
                              class="form-control product-description-field"
                              data-index="${index}"
                              rows="3"></textarea>
                    <div class="invalid-feedback"></div>
                </div>
            </div>
        `;

        var div = document.createElement('div');
        div.innerHTML = template.trim();
        return div.firstChild;
    }

    // Add product functionality
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function () {
            var newItem = createProductItem(productCount);
            productInfoContainer.appendChild(newItem);
            attachFieldListeners(newItem);
            productCount++;
            updateProductNumbers();
            updateCompositeValue();
        });
    }

    // Remove product functionality (event delegation)
    productInfoContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-product')) {
            var item = e.target.closest('.product-info-item');
            if (item && productInfoContainer.querySelectorAll('.product-info-item').length > 1) {
                item.remove();
                updateProductNumbers();
                updateCompositeValue();
            }
        }
    });

    // Initialize existing items
    var existingItems = productInfoContainer.querySelectorAll('.product-info-item');
    existingItems.forEach(function (item) {
        attachFieldListeners(item);
    });

    updateProductNumbers();
    updateCompositeValue();
});
