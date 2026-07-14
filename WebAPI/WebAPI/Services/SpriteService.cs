using WebAPI.Data;
using WebAPI.Data.Repositories;
using WebAPI.Mappers;
using WebAPI.Models;

namespace WebAPI.Services;

public class SpriteService(
    ISpriteRepository spriteRepository,
    IGroupRepository groupRepository,
    IPersistenceContext persistenceContext) : ISpriteService
{
    public async Task<SpriteDetailDto?> GetByIdAsync(int id, string userId)
    {
        var sprite = await spriteRepository.GetDetailForUserAsync(id, userId);
        return sprite?.ToDetailDto();
    }

    public async Task<SpriteDto?> CreateAsync(string userId, CreateSpriteDto dto)
    {
        var groupExists = await groupRepository.ExistsForUserAsync(dto.GroupId, userId);
        if (!groupExists)
        {
            return null;
        }

        var sprite = new Sprite
        {
            Name = dto.Name,
            Data = dto.Data,
            GroupId = dto.GroupId
        };

        spriteRepository.Add(sprite);
        await persistenceContext.SaveChangesAsync();

        return sprite.ToDto();
    }

    public async Task<SpriteDto?> UpdateAsync(int id, string userId, UpdateSpriteDto dto)
    {
        var sprite = await spriteRepository.GetForUserAsync(id, userId);
        if (sprite == null)
        {
            return null;
        }

        sprite.Data = dto.Data;
        await persistenceContext.SaveChangesAsync();

        return sprite.ToDto();
    }

    public async Task<SpriteDto?> RenameAsync(int id, string userId, RenameSpriteDto dto)
    {
        var sprite = await spriteRepository.GetForUserAsync(id, userId);
        if (sprite == null)
        {
            return null;
        }

        sprite.Name = dto.Name;
        await persistenceContext.SaveChangesAsync();

        return sprite.ToDto();
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var sprite = await spriteRepository.GetForUserAsync(id, userId);
        if (sprite == null)
        {
            return false;
        }

        spriteRepository.Remove(sprite);
        await persistenceContext.SaveChangesAsync();

        return true;
    }
}
