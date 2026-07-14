using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.ModelBinding;

public static class CurrentUserIdValidator
{
    public static void ValidateUsage(Assembly assembly)
    {
        var controllerTypes = assembly.GetTypes()
            .Where(t => typeof(ControllerBase).IsAssignableFrom(t) && !t.IsAbstract);

        foreach (var controllerType in controllerTypes)
        {
            var controllerAuthorized = controllerType.GetCustomAttribute<AuthorizeAttribute>() != null;
            var controllerAnonymous = controllerType.GetCustomAttribute<AllowAnonymousAttribute>() != null;

            foreach (var action in controllerType.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly))
            {
                var usesCurrentUserId = action.GetParameters()
                    .Any(p => p.GetCustomAttribute<CurrentUserIdAttribute>() != null);

                if (!usesCurrentUserId)
                {
                    continue;
                }

                var actionAuthorized = action.GetCustomAttribute<AuthorizeAttribute>() != null;
                var actionAnonymous = action.GetCustomAttribute<AllowAnonymousAttribute>() != null;

                var isProtected = (controllerAuthorized || actionAuthorized) && !controllerAnonymous && !actionAnonymous;

                if (!isProtected)
                {
                    throw new InvalidOperationException(
                        $"{controllerType.Name}.{action.Name} uses [CurrentUserId] but is not protected by [Authorize].");
                }
            }
        }
    }
}
