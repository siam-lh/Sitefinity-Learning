using Renderer.Entities;
using Renderer.ViewModels;

namespace Renderer.Models
{
    public interface IExtendedBreadcumbModel
    {
        Task<ExtendedBreadcrumbViewModel> Initialize(ExtendedBreadcrumbEntity entity);
    }
}
