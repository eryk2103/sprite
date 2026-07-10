namespace WebAPI.Models;

public class Project
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string UserId { get; set; }
    public User User { get; set; } = null!;
    public virtual ICollection<Group> Groups { get; set; } = new List<Group>();
}