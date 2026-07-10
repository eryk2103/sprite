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
}