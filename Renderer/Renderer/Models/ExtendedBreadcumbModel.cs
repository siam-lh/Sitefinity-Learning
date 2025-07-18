using Progress.Sitefinity.AspNetCore.Widgets.Models.Breadcrumb;
using Renderer.Entities;
using Renderer.ViewModels;
using System.Linq;

namespace Renderer.Models
{
    public class ExtendedBreadcumbModel : IExtendedBreadcumbModel
    {
        private readonly IBreadcrumbModel breadcrumbModel;

        public ExtendedBreadcumbModel(IBreadcrumbModel breadcrumbModel)
        {
            this.breadcrumbModel = breadcrumbModel;
        }


        //public async Task<ExtendedBreadcrumbViewModel> Initialize(ExtendedBreadcrumbEntity entity)
        //{
        //    var baseBreadcrumb = await breadcrumbModel.InitializeViewModel(entity);
        //    return new ExtendedBreadcrumbViewModel
        //    {
        //        Items = baseBreadcrumb.Pages,
        //        WrapperCssClass = $"{entity.WrapperCssClass} {entity.CustomCss}".Trim()
        //    };

        //}

        public async Task<ExtendedBreadcrumbViewModel> Initialize(ExtendedBreadcrumbEntity entity)
        {
            var baseBreadcrumb = await breadcrumbModel.InitializeViewModel(entity);
            var items = baseBreadcrumb.Pages;

            if (!entity.ShowParentPage && items != null && items.Count > 0)
            {
                if (items.Count > 1)
                {
                    items.RemoveAt(items.Count - 2); 
                }
                else
                {
                    items.RemoveAt(items.Count - 1); 
                }
            }

            return new ExtendedBreadcrumbViewModel
            {
                Items = items,
                WrapperCssClass = $"{entity.WrapperCssClass} {entity.CustomCss}".Trim()
            };
        }

    }
}
