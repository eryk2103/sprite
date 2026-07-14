using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Data.Repositories;

public class GroupRepository(AppDbContext context) : IGroupRepository
{
    public Task<bool> ExistsForUserAsync(int id, string userId) =>
        context.Groups.AnyAsync(g => g.Id == id && g.Project.UserId == userId);

    public Task<Group?> GetForUserAsync(int id, string userId) =>
        context.Groups
            .FirstOrDefaultAsync(g => g.Id == id && g.Project.UserId == userId);

    public Task<Group?> GetWithSpritesForUserAsync(int id, string userId) =>
        context.Groups
            .Include(g => g.Sprites)
            .FirstOrDefaultAsync(g => g.Id == id && g.Project.UserId == userId);

    public void Add(Group group) => context.Groups.Add(group);

    public void Remove(Group group) => context.Groups.Remove(group);
}
