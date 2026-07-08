using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Data;

public class AppDbContext: IdentityDbContext<User>
{
    public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
    {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
    }
}