using WebAPI.Models;

namespace WebAPI.Data.Repositories;

public interface IGroupRepository
{
    Task<bool> ExistsForUserAsync(int id, string userId);
    Task<Group?> GetForUserAsync(int id, string userId);
    Task<Group?> GetWithSpritesForUserAsync(int id, string userId);
    void Add(Group group);
    void Remove(Group group);
}
