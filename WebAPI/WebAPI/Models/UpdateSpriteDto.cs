using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class UpdateSpriteDto
{
    [Required]
    public required string Data { get; set; }
}
