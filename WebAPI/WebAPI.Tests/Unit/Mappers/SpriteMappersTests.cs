using WebAPI.Mappers;
using WebAPI.Models;

namespace WebAPI.Tests.Unit.Mappers;

public class SpriteMappersTests
{
    [Fact]
    public void ToDto_MapsIdAndName()
    {
        var sprite = new Sprite { Id = 1, Name = "Hero", Data = "[]", GroupId = 1 };

        var dto = sprite.ToDto();

        Assert.Equal(1, dto.Id);
        Assert.Equal("Hero", dto.Name);
    }

    [Fact]
    public void ToDetailDto_MapsIdNameAndData()
    {
        var sprite = new Sprite { Id = 1, Name = "Hero", Data = "[[\"#fff\"]]", GroupId = 1 };

        var dto = sprite.ToDetailDto();

        Assert.Equal(1, dto.Id);
        Assert.Equal("Hero", dto.Name);
        Assert.Equal("[[\"#fff\"]]", dto.Data);
    }
}
