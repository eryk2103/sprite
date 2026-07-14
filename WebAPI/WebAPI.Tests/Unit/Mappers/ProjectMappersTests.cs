using WebAPI.Mappers;
using WebAPI.Models;

namespace WebAPI.Tests.Unit.Mappers;

public class ProjectMappersTests
{
    [Fact]
    public void ToDto_MapsIdAndName()
    {
        var project = new Project { Id = 1, Name = "Alpha", UserId = "user-1" };

        var dto = project.ToDto();

        Assert.Equal(1, dto.Id);
        Assert.Equal("Alpha", dto.Name);
    }

    [Fact]
    public void ToDetailDto_MapsNestedGroupsAndSprites()
    {
        var project = new Project
        {
            Id = 1,
            Name = "Alpha",
            UserId = "user-1",
            Groups =
            [
                new Group
                {
                    Id = 10,
                    Name = "Group A",
                    ProjectId = 1,
                    Sprites = [new Sprite { Id = 100, Name = "Hero", Data = "[]", GroupId = 10 }]
                }
            ]
        };

        var dto = project.ToDetailDto();

        Assert.Equal("Alpha", dto.Name);
        Assert.Single(dto.Groups);
        Assert.Equal("Group A", dto.Groups[0].Name);
        Assert.Single(dto.Groups[0].Sprites);
        Assert.Equal("Hero", dto.Groups[0].Sprites[0].Name);
    }
}
