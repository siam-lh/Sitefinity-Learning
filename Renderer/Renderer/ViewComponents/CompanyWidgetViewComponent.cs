using Microsoft.AspNetCore.Mvc;
using Progress.Sitefinity.AspNetCore.RestSdk;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Progress.Sitefinity.Renderer.Entities.Content;
using Progress.Sitefinity.RestSdk;
using Renderer.Entities;
using Renderer.Models;
using Renderer.ViewModels;

namespace Renderer.ViewComponents
{
    [SitefinityWidget]
    public class CompanyWidgetViewComponent : ViewComponent
    {
        private readonly IRestClient restClient;

        public CompanyWidgetViewComponent(IRestClient restClient)
        {
            this.restClient = restClient;
        }

        public async Task<IViewComponentResult> InvokeAsync(IViewComponentContext<CompanyItem> context)
        {
            try
            {

                var companies = await restClient.GetItems<CompanyItem>(
                    new MixedContentContext
                    {
                        Content = new[] {
                        new ContentContext
                        {
                            Type = "Telerik.Sitefinity.DynamicTypes.Model.Cars.Company"
                        }
                        }
                    },
                    new GetAllArgs()
                    {
                        Fields = new[] { "Id", "Title", "Name", "Logo", "Description" }
                    });
                var companiesVM = companies.Items.Select(company => new CompanyViewModel
                {
                    Id = company.Id,
                    Title = company.Title,
                    Name = company.Name,
                    Description = company.Description,
                    LogoUrl = company.Logo.FirstOrDefault(),
                    
                }).ToList();
                return this.View("Default", companiesVM); 
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR: {ex.Message}");
                throw;
            }
        }
    }
}
