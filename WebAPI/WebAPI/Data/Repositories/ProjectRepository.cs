using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Data.Repositories;

public class ProjectRepository(AppDbContext context) : IProjectRepository
{
    public Task<List<Project>> GetAllForUserAsync(string userId) =>
        context.Projects
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .ToListAsync();

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
