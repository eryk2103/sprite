using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class UpdateGroupDto
{
    [Required]
    [MaxLength(200)]
    public required string Name { get; set; }
}
