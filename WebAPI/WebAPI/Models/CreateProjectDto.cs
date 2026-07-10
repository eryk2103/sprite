using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class CreateProjectDto
{ 
    [Required]
    [MaxLength(200)]
    public required string Name { get; set; }
}