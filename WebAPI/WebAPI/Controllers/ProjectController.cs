using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/projects")]
public class ProjectController(AppDbContext context): ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetAllProjects()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var projects = await context.Projects
            .Where(p => p.UserId == userId)
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Name = p.Name
            })
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProjectDetailDto>> GetProject(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var project = await context.Projects
            .Where(p => p.UserId == userId && p.Id == id)
            .Select(p => new ProjectDetailDto
            {
                Id = p.Id,
                Name = p.Name,
                Groups = p.Groups.Select(g => new GroupDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Sprites = g.Sprites.Select(s => new SpriteDto
                    {
                        Id = s.Id,
                        Name = s.Name
                    }).ToList()
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (project == null)
        {
            return NotFound(); 
        }

        return Ok(project);
    }

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject(CreateProjectDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var newProject = new Project()
        {
            UserId = userId,
            Name = dto.Name
        };

        context.Add(newProject);
        await context.SaveChangesAsync();

        return Ok(new ProjectDto { Id = newProject.Id, Name = newProject.Name });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProjectDto>> UpdateProject(int id, UpdateProjectDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var project = await context.Projects
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (project == null)
        {
            return NotFound();
        }

        project.Name = dto.Name;
        await context.SaveChangesAsync();

        return Ok(new ProjectDto { Id = project.Id, Name = project.Name });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var project = await context.Projects
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (project == null)
        {
            return NotFound();
        }

        context.Remove(project);
        await context.SaveChangesAsync();

        return NoContent();
    }
}