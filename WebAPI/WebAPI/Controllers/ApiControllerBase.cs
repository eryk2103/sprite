using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace WebAPI.Controllers;

[Authorize]
[ApiController]
public abstract class ApiControllerBase : ControllerBase, IAsyncActionFilter
{
    protected string UserId { get; private set; } = null!;

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            context.Result = Unauthorized();
            return;
        }

        UserId = userId;
        await next();
    }
}
