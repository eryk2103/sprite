using WebAPI.Models;

namespace WebAPI.Data.Repositories;

public interface ISpriteRepository
{
    Task<Sprite?> GetDetailForUserAsync(int id, string userId);
    Task<Sprite?> GetForUserAsync(int id, string userId);
    void Add(Sprite sprite);
    void Remove(Sprite sprite);
}
