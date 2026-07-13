using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class UpdateProjectDto
{
    [Required]
    [MaxLength(200)]
    public required string Name { get; set; }
}
