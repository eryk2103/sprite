using System.Security.Claims;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace WebAPI.ModelBinding;

public class CurrentUserIdModelBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var userId = bindingContext.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

        bindingContext.Result = userId is not null
            ? ModelBindingResult.Success(userId)
            : ModelBindingResult.Failed();

        return Task.CompletedTask;
    }
}
