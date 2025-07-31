using Renderer.Entities;

using System.Collections.Generic;

namespace Renderer.SD
{
    public static class MockContentService
    {
        public static Dictionary<string, List<string>> regions = new Dictionary<string, List<string>>
            {
                { "UK", new List<string> { "London", "Manchester", "Birmingham", "Leeds" } },
                { "EUROPE", new List<string> { "Germany", "France", "Italy", "Spain" } },
                { "AUSTRALIA", new List<string> { "Sydney", "Melbourne", "Brisbane", "Perth" } },
                { "MIDDLE EAST", new List<string> { "UAE", "Qatar", "Kuwait", "Saudi Arabia" } },
                { "AFRICAS", new List<string> { "Nigeria", "Kenya", "Egypt", "South Africa" } },
                { "AMERICAS", new List<string> { "USA", "Canada", "Mexico", "Brazil" } }
            };
        public static List<CompanyEntity> GetItems()
        {
            var companies = new List<CompanyEntity>();
            int companyId = 1;

            foreach (var region in regions)
            {
                foreach (var subRegion in region.Value)
                {
                    for (int i = 1; i <= 10; i++)
                    {
                        companies.Add(new CompanyEntity
                        {
                            CompanyName = $"{subRegion} {companyId}",
                            Region = region.Key,
                            SubRegion = subRegion,
                            PhoneNumber = $"+91000000{companyId:D4}",
                            Website = $"www.{region.Key.ToLower().Replace(" ", "")}{i}.com"
                        });

                        companyId++;
                    }
                }
            }

            return companies;
        }
    }
}

