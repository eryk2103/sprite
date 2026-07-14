using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Data.Repositories;

public class ProjectRepository(AppDbContext context) : IProjectRepository
{
    public async Task<(List<Project> Items, int TotalCount)> GetPagedForUserAsync(string userId, int page, int pageSize)
    {
        var query = context.Projects
            .AsNoTracking()
            .Where(p => p.UserId == userId);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(p => p.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public Task<Project?> GetDetailForUserAsync(int id, string userId) =>
        context.Projects
            .AsNoTracking()
            .Include(p => p.Groups)
            .ThenInclude(g => g.Sprites)
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

    public Task<Project?> GetForUserAsync(int id, string userId) =>
        context.Projects
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

    public Task<bool> ExistsForUserAsync(int id, string userId) =>
        context.Projects.AnyAsync(p => p.Id == id && p.UserId == userId);

    public void Add(Project project) => context.Projects.Add(project);

    public void Remove(Project project) => context.Projects.Remove(project);
}
