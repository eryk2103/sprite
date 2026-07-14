using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.ModelBinding;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/projects")]
public class ProjectController(IProjectService projectService, ILogger<ProjectController> logger): ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<ProjectDto>>> GetAllProjects(
        [CurrentUserId] string userId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        return Ok(await projectService.GetAllAsync(userId, page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProjectDetailDto>> GetProject(int id, [CurrentUserId] string userId)
    {
        var project = await projectService.GetByIdAsync(id, userId);
        if (project == null)
        {
            return NotFound();
        }

        return Ok(project);
    }

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject(CreateProjectDto dto, [CurrentUserId] string userId)
    {
        try
        {
            return Ok(await projectService.CreateAsync(userId, dto));
        }
        catch (DbUpdateException ex)
        {
            logger.LogWarning(ex, "Conflict creating project {ProjectName} for user {UserId}", dto.Name, userId);
            return Conflict("A project with this name already exists.");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProjectDto>> UpdateProject(int id, UpdateProjectDto dto, [CurrentUserId] string userId)
    {
        try
        {
            var project = await projectService.UpdateAsync(id, userId, dto);
            if (project == null)
            {
                return NotFound();
            }

            return Ok(project);
        }
        catch (DbUpdateException ex)
        {
            logger.LogWarning(ex, "Conflict renaming project {ProjectId} to {ProjectName} for user {UserId}", id, dto.Name, userId);
            return Conflict("A project with this name already exists.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id, [CurrentUserId] string userId)
    {
        var deleted = await projectService.DeleteAsync(id, userId);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
