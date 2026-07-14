using Microsoft.AspNetCore.Mvc;

namespace WebAPI.ModelBinding;

public class CurrentUserIdAttribute : ModelBinderAttribute
{
    public CurrentUserIdAttribute()
    {
        BinderType = typeof(CurrentUserIdModelBinder);
    }
}
