using Renderer.ViewModels;

namespace Renderer.Services
{
    public interface IElectronicsProductService
    {
        Task<ElectronicsProductViewModel> GetProductByIdAsync(string productId);
        Task<List<ElectronicsProductViewModel>> GetAllProductsAsync();
    }
}
