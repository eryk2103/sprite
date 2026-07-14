using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.ModelBinding;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/sprites")]
public class SpriteController(ISpriteService spriteService, ILogger<SpriteController> logger) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<SpriteDetailDto>> GetSprite(int id, [CurrentUserId] string userId)
    {
        var sprite = await spriteService.GetByIdAsync(id, userId);
        if (sprite == null)
        {
            return NotFound();
        }

        return Ok(sprite);
    }

    [HttpPost]
    public async Task<ActionResult<SpriteDto>> CreateSprite(CreateSpriteDto dto, [CurrentUserId] string userId)
    {
        try
        {
            var sprite = await spriteService.CreateAsync(userId, dto);
            if (sprite == null)
            {
                return NotFound();
            }

            return Ok(sprite);
        }
        catch (DbUpdateException ex)
        {
            logger.LogWarning(ex, "Conflict creating sprite {SpriteName} in group {GroupId} for user {UserId}", dto.Name, dto.GroupId, userId);
            return Conflict("A sprite with this name already exists.");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SpriteDto>> UpdateSprite(int id, UpdateSpriteDto dto, [CurrentUserId] string userId)
    {
        var sprite = await spriteService.UpdateAsync(id, userId, dto);
        if (sprite == null)
        {
            return NotFound();
        }

        return Ok(sprite);
    }

    [HttpPut("{id}/rename")]
    public async Task<ActionResult<SpriteDto>> RenameSprite(int id, RenameSpriteDto dto, [CurrentUserId] string userId)
    {
        try
        {
            var sprite = await spriteService.RenameAsync(id, userId, dto);
            if (sprite == null)
            {
                return NotFound();
            }

            return Ok(sprite);
        }
        catch (DbUpdateException ex)
        {
            logger.LogWarning(ex, "Conflict renaming sprite {SpriteId} to {SpriteName} for user {UserId}", id, dto.Name, userId);
            return Conflict("A sprite with this name already exists.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSprite(int id, [CurrentUserId] string userId)
    {
        var deleted = await spriteService.DeleteAsync(id, userId);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
