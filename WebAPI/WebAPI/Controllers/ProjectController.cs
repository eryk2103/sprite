using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.ModelBinding;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/projects")]
public class ProjectController(IProjectService projectService): ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetAllProjects([CurrentUserId] string userId)
    {
        return Ok(await projectService.GetAllAsync(userId));
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
        return Ok(await projectService.CreateAsync(userId, dto));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProjectDto>> UpdateProject(int id, UpdateProjectDto dto, [CurrentUserId] string userId)
    {
        var project = await projectService.UpdateAsync(id, userId, dto);
        if (project == null)
        {
            return NotFound();
        }

        return Ok(project);
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
