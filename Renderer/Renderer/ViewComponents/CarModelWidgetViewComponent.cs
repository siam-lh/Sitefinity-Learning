using Microsoft.AspNetCore.Mvc;
using Progress.Sitefinity.AspNetCore.RestSdk;
using Progress.Sitefinity.AspNetCore.ViewComponents;
using Progress.Sitefinity.Renderer.Entities.Content;
using Progress.Sitefinity.RestSdk;
using Progress.Sitefinity.RestSdk.Client;
using Progress.Sitefinity.RestSdk.Dto;
using Progress.Sitefinity.RestSdk.Filters;
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
                var filterVal = Guid.Parse("3a7cafbf-75f1-49bc-b02b-1cbb70179c81");

                var tags = new[] { Guid.Parse("42ab6f08-bb4b-4794-bb3e-317e9b96edab") };
                var allFilters = tags.Select(tag =>
                {
                    var filter = new FilterClause()
                    {
                        FieldName = nameof(CarModelItem.companyidentity),
                        FieldValue = tag,
                        Operator = FilterClause.Operators.Equal,
                    };

                    return (object)filter;
                }).ToList();

                var combinedFilter = new CombinedFilter()
                {
                    Operator = CombinedFilter.LogicalOperators.Or,
                    ChildFilters = allFilters,
                };

                combinedFilter.ChildFilters.Add(new FilterClause
                {
                    FieldName = nameof(CarModelItem.Title),
                    Operator = FilterClause.Operators.Equal,
                    FieldValue = "Lamborghini Urus 2025"
                });

                combinedFilter.ChildFilters.Add(new FilterClause
                {
                    FieldName = "CompanyName.Id",
                    Operator = FilterClause.Operators.Equal,
                    FieldValue = filterVal
                });

                var carModels = await restClient.GetItems<CarModelItem>(
                    new GetAllArgs()
                    {
                        Count = true,
                        Filter = combinedFilter,
                        Fields = new[] { "Id", "Title", "Model", "Logo", "CompanyName", "Description", "companyidentity" },
                        OrderBy = new[] { new OrderBy() { Name = "Title", Type = OrderType.Ascending } }
                    });

                var carModelsVM = carModels.Items.Select(carModel => new CarModelViewModel
                {
                    Id = carModel.Id,
                    Title = carModel.Title,
                    Model = carModel.Model,
                    Description = carModel.Description,
                    LogoUrl = carModel.Logo.FirstOrDefault(),
                    Company = carModel.CompanyName.FirstOrDefault(),

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
