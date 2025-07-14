using Microsoft.AspNetCore.Mvc;
using Progress.Sitefinity.AspNetCore.RestSdk;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Progress.Sitefinity.Renderer.Entities.Content;
using Progress.Sitefinity.RestSdk;
using Renderer.Entities;
using Renderer.Models;

namespace Renderer.ViewComponents
{
    [SitefinityWidget]
    public class CarModelWidgetViewComponent : ViewComponent
    {
        private readonly IRestClient restClient;

        public CarModelWidgetViewComponent(IRestClient restClient)
        {
            this.restClient = restClient;
        }

        public async Task<IViewComponentResult> InvokeAsync(IViewComponentContext<CarModelItem> context)
        {
            try
            {

                var carModels = await restClient.GetItems<CarModelItem>(
                    new MixedContentContext
                    {
                        Content = new[] {
                        new ContentContext
                        {
                            Type = "Telerik.Sitefinity.DynamicTypes.Model.Cars.Models"
                        }
                        }
                    },
                    new GetAllArgs()
                    {
                        Fields = new[] { "Id", "Title", "Model", "Logo", "CompanyName", "Description" }
                    });
                var carModelsVM = carModels.Items.Select(carModel => new CarModelViewModel
                {
                    Id = carModel.Id,
                    Title = carModel.Title,
                    Model = carModel.Model,
                    Description = carModel.Description,
                    LogoUrl = carModel.Logo.FirstOrDefault(),
                    Company= carModel.CompanyName.FirstOrDefault(),

                }).ToList();
                return this.View("Default", carModelsVM); 
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR: {ex.Message}");
                throw;
            }
        }
    }
}
