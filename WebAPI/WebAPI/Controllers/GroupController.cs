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

        return Ok(new GroupDto { Id = newGroup.Id, Name = newGroup.Name, Sprites = [] });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<GroupDto>> UpdateGroup(int id, UpdateGroupDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var group = await context.Groups
            .Include(g => g.Sprites)
            .FirstOrDefaultAsync(g => g.Id == id && g.Project.UserId == userId);

        if (group == null)
        {
            return NotFound();
        }

        group.Name = dto.Name;
        await context.SaveChangesAsync();

        return Ok(new GroupDto
        {
            Id = group.Id,
            Name = group.Name,
            Sprites = group.Sprites.Select(s => new SpriteDto { Id = s.Id, Name = s.Name }).ToList()
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGroup(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var group = await context.Groups
            .FirstOrDefaultAsync(g => g.Id == id && g.Project.UserId == userId);

        if (group == null)
        {
            return NotFound();
        }

        context.Remove(group);
        await context.SaveChangesAsync();

        return NoContent();
    }
}