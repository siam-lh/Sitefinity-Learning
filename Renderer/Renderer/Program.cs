using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using NWebsec.AspNetCore.Middleware;
using Progress.Sitefinity.AspNetCore;
using Progress.Sitefinity.AspNetCore.FormWidgets;
using Renderer.Models;
using Renderer.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
// Add services to the container.
builder.Services.AddSitefinity();
builder.Services.AddViewComponentModels();
builder.Services.AddFormViewComponentModels();

builder.Services.AddScoped<IElectronicsProductService, ElectronicsProductService>();
builder.Services.AddScoped<IMegaMenuModel, MegaMenuModel>();
builder.Services.AddScoped<ICustomNavigationModel, CustomNavigationModel>();
builder.Services.AddScoped<IExtendedBreadcumbModel, ExtendedBreadcumbModel>();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.Use(async (context, next) =>
    //{
    //    // Remove any existing CSP header injected earlier
    //    context.Response.OnStarting(() =>
    //    {
    //        var nonce = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
    //        context.Items["CSP-Nonce"] = nonce;
    //        context.Response.Headers["Content-Security-Policy"] =
    //            $"default-src 'self' http://localhost:53939  wss://localhost:44379 wss://localhost:44398 ws://localhost:53939; " +
    //            $"connect-src 'self' http://localhost:53939 wss://localhost:44379 wss://localhost:44398 ws://localhost:53939; " +
    //            $"script-src 'self' 'nonce-{nonce}' ; " +
    //             $"style-src 'self' 'unsafe-inline'; " +
    //            "media-src 'self'; " +
    //            "img-src 'self' data:;";
    //        return Task.CompletedTask;
    //    });

    //    await next();
    //});


    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseStaticFiles();
app.UseRouting();
app.UseSitefinity();

app.UseEndpoints(endpoints =>
{
    endpoints.MapSitefinityEndpoints();
});

app.Run();