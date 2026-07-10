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
    public async Task<ActionResult<IEnumerable<Project>>> GetAllProjects()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }
        
        var projects = await context.Projects.Where(p => p.UserId == userId).ToListAsync();
        
        return Ok(projects);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Project>> GetProject(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }
        
        var project = await context.Projects.FirstOrDefaultAsync(p => p.UserId == userId && p.Id == id);
        if (project == null)
        {
            return NotFound();
        }
        
        return Ok(project);
    }

    [HttpPost]
    public async Task<ActionResult<Project>> CreateProject(CreateProjectDto dto)
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
        
        return Ok(newProject);
    }
}