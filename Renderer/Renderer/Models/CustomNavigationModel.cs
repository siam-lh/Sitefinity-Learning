using Progress.Sitefinity.AspNetCore.RestSdk;
using Progress.Sitefinity.AspNetCore.Widgets.Models.Navigation;
using Progress.Sitefinity.RestSdk;
using Progress.Sitefinity.RestSdk.Clients.Pages.Dto;
using Renderer.Entities;
using Renderer.ViewModels;

namespace Renderer.Models
{
    public class CustomNavigationModel : ICustomNavigationModel
    {
        private readonly INavigationModel navigationModel;
        private readonly IRestClient restClient;

        public CustomNavigationModel(INavigationModel navigationModel, IRestClient restClient)
        {
            this.navigationModel = navigationModel;
            this.restClient = restClient;
        }

        public async Task<CustomNavigationViewModel> Initialize(CustomNavigationEntity entity)
        {
            var baseNav = await navigationModel.InitializeViewModel(entity);

            //if (entity.SelectionMode == PageSelectionMode.SelectedPageChildren && entity.ShowParentPage && entity.SelectedPage != null)
            //{
            //    var parentPage = await restClient.GetItem<PageNodeDto>(entity.SelectedPage);
            //    if (parentPage != null)
            //    {
            //        var wrappedParent = new PageViewModel
            //        {
            //            Title = parentPage.Title,
            //            Url = parentPage.ViewUrl,
            //            Key = parentPage.Id.ToString(),
            //            LinkTarget = "_self",
            //            ChildNodes = baseNav.Nodes
            //        };
            //        baseNav.Nodes = new List<PageViewModel> { wrappedParent };
            //    }
            //}

            return new CustomNavigationViewModel
            {
                Nodes = baseNav.Nodes,
                WrapperCssClass = $"{entity.WrapperCssClass} {entity.CustomCss}".Trim()
            };
        }
    }
}
