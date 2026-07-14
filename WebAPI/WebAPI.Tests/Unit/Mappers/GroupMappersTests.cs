using WebAPI.Mappers;
using WebAPI.Models;

namespace WebAPI.Tests.Unit.Mappers;

public class GroupMappersTests
{
    [Fact]
    public void ToDto_MapsIdNameAndSprites()
    {
        var group = new Group
        {
            Id = 1,
            Name = "Group A",
            ProjectId = 1,
            Sprites =
            [
                new Sprite { Id = 1, Name = "Hero", Data = "[]", GroupId = 1 },
                new Sprite { Id = 2, Name = "Villain", Data = "[]", GroupId = 1 }
            ]
        };

        var dto = group.ToDto();

        Assert.Equal("Group A", dto.Name);
        Assert.Equal(2, dto.Sprites.Count);
        Assert.Equal("Hero", dto.Sprites[0].Name);
        Assert.Equal("Villain", dto.Sprites[1].Name);
    }

    [Fact]
    public void ToDto_ReturnsEmptySpritesList_WhenGroupHasNoSprites()
    {
        var group = new Group { Id = 1, Name = "Empty Group", ProjectId = 1 };

        var dto = group.ToDto();

        Assert.Empty(dto.Sprites);
    }
}
