using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.ModelBinding;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/groups")]
public class GroupController(IGroupService groupService, ILogger<GroupController> logger): ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<GroupDto>> CreateGroup(CreateGroupDto dto, [CurrentUserId] string userId)
    {
        try
        {
            var group = await groupService.CreateAsync(userId, dto);
            if (group == null)
            {
                return NotFound();
            }

            return Ok(group);
        }
        catch (DbUpdateException ex)
        {
            logger.LogWarning(ex, "Conflict creating group {GroupName} in project {ProjectId} for user {UserId}", dto.Name, dto.ProjectId, userId);
            return Conflict("A group with this name already exists.");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<GroupDto>> UpdateGroup(int id, UpdateGroupDto dto, [CurrentUserId] string userId)
    {
        try
        {
            var group = await groupService.UpdateAsync(id, userId, dto);
            if (group == null)
            {
                return NotFound();
            }

            return Ok(group);
        }
        catch (DbUpdateException ex)
        {
            logger.LogWarning(ex, "Conflict renaming group {GroupId} to {GroupName} for user {UserId}", id, dto.Name, userId);
            return Conflict("A group with this name already exists.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGroup(int id, [CurrentUserId] string userId)
    {
        var deleted = await groupService.DeleteAsync(id, userId);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}

