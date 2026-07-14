using WebAPI.Models;

namespace WebAPI.Data.Repositories;

public interface IProjectRepository
{
    Task<List<Project>> GetAllForUserAsync(string userId);
    Task<Project?> GetDetailForUserAsync(int id, string userId);
    Task<Project?> GetForUserAsync(int id, string userId);
    Task<bool> ExistsForUserAsync(int id, string userId);
    void Add(Project project);
    void Remove(Project project);
}
