using Microsoft.AspNetCore.Mvc.ModelBinding;
using Renderer.Models;

namespace Renderer.ModelBinders
{
    public class ProductModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
            {
                throw new ArgumentNullException(nameof(bindingContext));
            }

            var fieldName = bindingContext.ModelName;
            var productTitleKey = fieldName + "_ProductTitle";
            var productDescriptionKey = fieldName + "_ProductDescription";

            var productTitleValue = bindingContext.ValueProvider.GetValue(productTitleKey);
            var productDescriptionValue = bindingContext.ValueProvider.GetValue(productDescriptionKey);

            if (productTitleValue == ValueProviderResult.None && productDescriptionValue == ValueProviderResult.None)
            {
                return Task.CompletedTask;
            }

            var product = new Product
            {
                ProductTitle = productTitleValue.FirstValue,
                ProductDescription = productDescriptionValue.FirstValue
            };

            bindingContext.ModelState.SetModelValue(fieldName, new ValueProviderResult(
                new Microsoft.Extensions.Primitives.StringValues(productTitleValue.FirstValue + "|" + productDescriptionValue.FirstValue)));

            bindingContext.Result = ModelBindingResult.Success(product);
            return Task.CompletedTask;
        }
    }

    public class ProductModelBinderProvider : IModelBinderProvider
    {
        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {
            if (context.Metadata.ModelType == typeof(Product))
            {
                return new ProductModelBinder();
            }

            return null;
        }
    }
}
