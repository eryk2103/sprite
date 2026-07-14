using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class CreateSpriteDto
{
    [Required]
    public int GroupId { get; set; }

    [Required]
    [MaxLength(200)]
    public required string Name { get; set; }

    // 64x64 is the largest grid the editor offers (~41,000 chars as serialized JSON); this leaves headroom.
    [Required]
    [MaxLength(200_000)]
    public required string Data { get; set; }
}
