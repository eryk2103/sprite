namespace WebAPI.Models;

public class Group
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    public virtual ICollection<Sprite> Sprites { get; set; } = new List<Sprite>();
}