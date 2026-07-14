using WebAPI.Models;

namespace WebAPI.Data.Repositories;

public interface IProjectRepository
{
    Task<(List<Project> Items, int TotalCount)> GetPagedForUserAsync(string userId, int page, int pageSize);
    Task<Project?> GetDetailForUserAsync(int id, string userId);
    Task<Project?> GetForUserAsync(int id, string userId);
    Task<bool> ExistsForUserAsync(int id, string userId);
    void Add(Project project);
    void Remove(Project project);
}
