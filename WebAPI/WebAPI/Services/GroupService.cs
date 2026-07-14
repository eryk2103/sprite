using WebAPI.Data;
using WebAPI.Data.Repositories;
using WebAPI.Mappers;
using WebAPI.Models;

namespace WebAPI.Services;

public class GroupService(
    IGroupRepository groupRepository,
    IProjectRepository projectRepository,
    IPersistenceContext persistenceContext) : IGroupService
{
    public async Task<GroupDto?> CreateAsync(string userId, CreateGroupDto dto)
    {
        var projectExists = await projectRepository.ExistsForUserAsync(dto.ProjectId, userId);
        if (!projectExists)
        {
            return null;
        }

        var group = new Group
        {
            Name = dto.Name,
            ProjectId = dto.ProjectId
        };

        groupRepository.Add(group);
        await persistenceContext.SaveChangesAsync();

        return group.ToDto();
    }

    public async Task<GroupDto?> UpdateAsync(int id, string userId, UpdateGroupDto dto)
    {
        var group = await groupRepository.GetWithSpritesForUserAsync(id, userId);
        if (group == null)
        {
            return null;
        }

        group.Name = dto.Name;
        await persistenceContext.SaveChangesAsync();

        return group.ToDto();
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var group = await groupRepository.GetForUserAsync(id, userId);
        if (group == null)
        {
            return false;
        }

        groupRepository.Remove(group);
        await persistenceContext.SaveChangesAsync();

        return true;
    }
}
