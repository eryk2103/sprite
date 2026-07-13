using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class RenameSpriteDto
{
    [Required]
    [MaxLength(200)]
    public required string Name { get; set; }
}
