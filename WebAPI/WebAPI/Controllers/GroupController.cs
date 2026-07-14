using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.ModelBinding;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/groups")]
public class GroupController(IGroupService groupService): ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<GroupDto>> CreateGroup(CreateGroupDto dto, [CurrentUserId] string userId)
    {
        var group = await groupService.CreateAsync(userId, dto);
        if (group == null)
        {
            return NotFound();
        }

        return Ok(group);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<GroupDto>> UpdateGroup(int id, UpdateGroupDto dto, [CurrentUserId] string userId)
    {
        var group = await groupService.UpdateAsync(id, userId, dto);
        if (group == null)
        {
            return NotFound();
        }

        return Ok(group);
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
