using WebAPI.Models;

namespace WebAPI.Services;

public interface ISpriteService
{
    Task<SpriteDetailDto?> GetByIdAsync(int id, string userId);
    Task<SpriteDto?> CreateAsync(string userId, CreateSpriteDto dto);
    Task<SpriteDto?> UpdateAsync(int id, string userId, UpdateSpriteDto dto);
    Task<SpriteDto?> RenameAsync(int id, string userId, RenameSpriteDto dto);
    Task<bool> DeleteAsync(int id, string userId);
}
