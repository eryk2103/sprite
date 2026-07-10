namespace WebAPI.Models;

public class ProjectDetailDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required List<GroupDto> Groups { get; set; }
}
