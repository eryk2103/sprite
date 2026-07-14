using WebAPI.Data;
using WebAPI.Data.Repositories;
using WebAPI.Mappers;
using WebAPI.Models;

namespace WebAPI.Services;

public class ProjectService(IProjectRepository projectRepository, IPersistenceContext persistenceContext) : IProjectService
{
    public async Task<PagedResult<ProjectDto>> GetAllAsync(string userId, int page, int pageSize)
    {
        var (projects, totalCount) = await projectRepository.GetPagedForUserAsync(userId, page, pageSize);

        return new PagedResult<ProjectDto>
        {
            Items = projects.Select(p => p.ToDto()).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<ProjectDetailDto?> GetByIdAsync(int id, string userId)
    {
        var project = await projectRepository.GetDetailForUserAsync(id, userId);
        return project?.ToDetailDto();
    }

    public async Task<ProjectDto> CreateAsync(string userId, CreateProjectDto dto)
    {
        var project = new Project
        {
            UserId = userId,
            Name = dto.Name
        };

        projectRepository.Add(project);
        await persistenceContext.SaveChangesAsync();

        return project.ToDto();
    }

    public async Task<ProjectDto?> UpdateAsync(int id, string userId, UpdateProjectDto dto)
    {
        var project = await projectRepository.GetForUserAsync(id, userId);
        if (project == null)
        {
            return null;
        }

        project.Name = dto.Name;
        await persistenceContext.SaveChangesAsync();

        return project.ToDto();
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var project = await projectRepository.GetForUserAsync(id, userId);
        if (project == null)
        {
            return false;
        }

        projectRepository.Remove(project);
        await persistenceContext.SaveChangesAsync();

        return true;
    }
}
