using Renderer.Entities;
using Renderer.ViewModels;

namespace Renderer.Models
{
    public interface ICustomNavigationModel
    {
        Task<CustomNavigationViewModel> Initialize(CustomNavigationEntity entity);
    }
}
