using WebAPI.Models;

namespace WebAPI.Mappers;

public static class SpriteMappers
{
    public static SpriteDto ToDto(this Sprite sprite) => new()
    {
        Id = sprite.Id,
        Name = sprite.Name
    };

    public static SpriteDetailDto ToDetailDto(this Sprite sprite) => new()
    {
        Id = sprite.Id,
        Name = sprite.Name,
        Data = sprite.Data
    };
}
