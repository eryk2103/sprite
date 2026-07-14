using WebAPI.Models;

namespace WebAPI.Services;

public interface IGroupService
{
    Task<GroupDto?> CreateAsync(string userId, CreateGroupDto dto);
    Task<GroupDto?> UpdateAsync(int id, string userId, UpdateGroupDto dto);
    Task<bool> DeleteAsync(int id, string userId);
}
