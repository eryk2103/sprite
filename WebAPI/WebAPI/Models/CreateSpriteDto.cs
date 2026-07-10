using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class CreateSpriteDto
{
    [Required]
    public int GroupId { get; set; }

    [Required]
    [MaxLength(200)]
    public required string Name { get; set; }

    [Required]
    public required string Data { get; set; }
}
