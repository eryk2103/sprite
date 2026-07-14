using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Data.Repositories;

public class SpriteRepository(AppDbContext context) : ISpriteRepository
{
    public Task<Sprite?> GetDetailForUserAsync(int id, string userId) =>
        context.Sprites
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id && s.Group.Project.UserId == userId);

    public Task<Sprite?> GetForUserAsync(int id, string userId) =>
        context.Sprites
            .FirstOrDefaultAsync(s => s.Id == id && s.Group.Project.UserId == userId);

    public void Add(Sprite sprite) => context.Sprites.Add(sprite);

    public void Remove(Sprite sprite) => context.Sprites.Remove(sprite);
}
