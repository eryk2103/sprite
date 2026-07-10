using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/groups")]
public class GroupController(AppDbContext context): ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await context.Groups.ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult<GroupDto>> CreateGroup(CreateGroupDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var projectExists = await context.Projects
            .AnyAsync(p => p.Id == dto.ProjectId && p.UserId == userId);

        if (!projectExists)
        {
            return NotFound();
        }

        var newGroup = new Group()
        {
            Name = dto.Name,
            ProjectId = dto.ProjectId
        };

        context.Add(newGroup);
        await context.SaveChangesAsync();

        return Ok(new GroupDto { Id = newGroup.Id, Name = newGroup.Name });
    }
}