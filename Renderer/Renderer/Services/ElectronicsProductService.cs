using Progress.Sitefinity.AspNetCore.RestSdk;
using Progress.Sitefinity.Renderer.Entities.Content;
using Progress.Sitefinity.RestSdk;
using Renderer.ViewModels;

namespace Renderer.Services
{
    public class ElectronicsProductService : IElectronicsProductService
    {
        private readonly IRestClient restClient;

        public ElectronicsProductService(IRestClient restClient)
        {
            this.restClient = restClient;
        }

        public async Task<ElectronicsProductViewModel> GetProductByIdAsync(string productId)
        {
            if (string.IsNullOrEmpty(productId))
                return new ElectronicsProductViewModel();

            var product = await restClient.GetItem<ElectronicsProductEntity>(
                new GetItemArgs()
                {
                    Id = productId,
                    Fields = new[] { "Id", "Title", "Description", "ProductImage" }
                });

            if (product == null)
                return new ElectronicsProductViewModel();

            return new ElectronicsProductViewModel
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                ImageDefaultUrl = ImageUrl(product.ProductImage)
            };
        }

        public async Task<List<ElectronicsProductViewModel>> GetAllProductsAsync()
        {
            var products = await restClient.GetItems<ElectronicsProductEntity>(
                new MixedContentContext
                {
                    Content = new[] {
                        new ContentContext
                        {
                            Type = "Telerik.Sitefinity.DynamicTypes.Model.Products.elctronics_products"
                        }
                    }
                },
                new GetAllArgs()
                {
                    Fields = new[] { "Id", "Title", "Description", "ProductImage" }
                });

            return products.Items.Select(product => new ElectronicsProductViewModel
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                ImageDefaultUrl = ImageUrl(product.ProductImage)
            }).ToList();
        }

        private string ImageUrl(IEnumerable<LogoViewModel> images)
        {
            var item = images?.FirstOrDefault();
            return item?.Url;
        }
    }
}
