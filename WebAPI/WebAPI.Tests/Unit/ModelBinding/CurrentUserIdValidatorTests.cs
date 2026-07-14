using Microsoft.AspNetCore.Mvc;
using WebAPI.ModelBinding;

namespace WebAPI.Tests.Unit.ModelBinding;

file class UnprotectedController : ControllerBase
{
    [HttpGet]
    public IActionResult Get([CurrentUserId] string userId) => Ok(userId);
}

public class CurrentUserIdValidatorTests
{
    [Fact]
    public void ValidateUsage_DoesNotThrow_ForRealWebApiControllers()
    {
        var exception = Record.Exception(() => CurrentUserIdValidator.ValidateUsage(typeof(Program).Assembly));

        Assert.Null(exception);
    }

    [Fact]
    public void ValidateUsage_Throws_WhenCurrentUserIdUsedWithoutAuthorize()
    {
        var exception = Assert.Throws<InvalidOperationException>(
            () => CurrentUserIdValidator.ValidateUsage(typeof(UnprotectedController).Assembly));

        Assert.Contains(nameof(UnprotectedController), exception.Message);
        Assert.Contains(nameof(UnprotectedController.Get), exception.Message);
    }
}
