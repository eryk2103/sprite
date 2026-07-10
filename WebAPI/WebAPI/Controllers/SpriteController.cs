using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/sprites")]
public class SpriteController(AppDbContext context) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<SpriteDetailDto>> GetSprite(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var sprite = await context.Sprites
            .Where(s => s.Id == id && s.Group.Project.UserId == userId)
            .Select(s => new SpriteDetailDto
            {
                Id = s.Id,
                Name = s.Name,
                Data = s.Data
            })
            .FirstOrDefaultAsync();

        if (sprite == null)
        {
            return NotFound();
        }

        return Ok(sprite);
    }

    [HttpPost]
    public async Task<ActionResult<SpriteDto>> CreateSprite(CreateSpriteDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var groupExists = await context.Groups
            .AnyAsync(g => g.Id == dto.GroupId && g.Project.UserId == userId);

        if (!groupExists)
        {
            return NotFound();
        }

        var newSprite = new Sprite()
        {
            Name = dto.Name,
            Data = dto.Data,
            GroupId = dto.GroupId
        };

        context.Add(newSprite);
        await context.SaveChangesAsync();

        return Ok(new SpriteDto { Id = newSprite.Id, Name = newSprite.Name });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SpriteDto>> UpdateSprite(int id, UpdateSpriteDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var sprite = await context.Sprites
            .FirstOrDefaultAsync(s => s.Id == id && s.Group.Project.UserId == userId);

        if (sprite == null)
        {
            return NotFound();
        }

        sprite.Data = dto.Data;
        await context.SaveChangesAsync();

        return Ok(new SpriteDto { Id = sprite.Id, Name = sprite.Name });
    }
}
