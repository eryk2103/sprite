namespace WebAPI.Models;

public class Sprite
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Data { get; set; }
    public int GroupId { get; set; }
    public Group Group { get; set; } = null!;
}