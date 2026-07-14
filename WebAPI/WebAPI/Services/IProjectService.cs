using WebAPI.Models;

namespace WebAPI.Services;

public interface IProjectService
{
    Task<List<ProjectDto>> GetAllAsync(string userId);
    Task<ProjectDetailDto?> GetByIdAsync(int id, string userId);
    Task<ProjectDto> CreateAsync(string userId, CreateProjectDto dto);
    Task<ProjectDto?> UpdateAsync(int id, string userId, UpdateProjectDto dto);
    Task<bool> DeleteAsync(int id, string userId);
}
