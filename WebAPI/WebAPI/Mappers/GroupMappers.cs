using WebAPI.Models;

namespace WebAPI.Mappers;

public static class GroupMappers
{
    public static GroupDto ToDto(this Group group) => new()
    {
        Id = group.Id,
        Name = group.Name,
        Sprites = group.Sprites.Select(s => s.ToDto()).ToList()
    };
}
