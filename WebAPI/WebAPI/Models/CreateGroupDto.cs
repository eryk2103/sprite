using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class CreateGroupDto
{
    [Required]
    [MaxLength(200)]
    public required string Name { get; set; }

    [Required]
    public int ProjectId { get; set; }
}
