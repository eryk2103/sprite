using Microsoft.AspNetCore.Identity;

namespace WebAPI.Models;

public class User: IdentityUser
{
    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
}