
using System;
using Microsoft.AspNetCore.Mvc;
using Renderer.Entities;
using Progress.Sitefinity.AspNetCore.ViewComponents;

namespace Renderer.ViewComponents
{
    [SitefinityWidget]
    public class BrighTonSEOFooterViewComponent : ViewComponent
    {
        // Invokes the view.
        public IViewComponentResult Invoke()
        {
            return this.View();
        }
    }
}