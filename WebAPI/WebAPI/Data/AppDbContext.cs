using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Data;

public class AppDbContext: IdentityDbContext<User>
{
    public DbSet<Project> Projects { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<Sprite> Sprites { get; set; }
    
    public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
    {}

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Project>(project =>
        {
            project.HasKey(p => p.Id);
            
            project.Property(p => p.Name)
                .HasMaxLength(200)
                .IsRequired();

            project.HasIndex(p => p.Name);
            
            project.Property(p => p.UserId)
                .IsRequired();

            project.HasOne(p => p.User)
                .WithMany(u => u.Projects)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            project.HasIndex(p => new { p.UserId, p.Name })
                .IsUnique();
        });
        
        builder.Entity<Group>(entity =>
        {
            entity.HasKey(g => g.Id);

            entity.Property(g => g.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(g => g.ProjectId)
                .IsRequired();

            entity.HasOne(g => g.Project)
                .WithMany(p => p.Groups)
                .HasForeignKey(g => g.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(g => new { g.ProjectId, g.Name })
                .IsUnique();
        });
        
        builder.Entity<Sprite>(sprite =>
        {
            sprite.HasKey(s => s.Id);

            sprite.Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(200);
            
            sprite.Property(s => s.Data)
                .HasColumnType("nvarchar(max)")
                .IsRequired();
            
            sprite.Property(s => s.GroupId)
                .IsRequired();

            sprite.HasOne(s => s.Group)
                .WithMany(g => g.Sprites)
                .HasForeignKey(s => s.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            sprite.HasIndex(s => new { s.GroupId, s.Name })
                .IsUnique();
        });
    }
}