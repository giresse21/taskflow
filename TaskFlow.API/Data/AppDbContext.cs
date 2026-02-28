using Microsoft.EntityFrameworkCore;
using TaskFlow.API.Models;

namespace TaskFlow.API.Data;

public class AppDbContext : DbContext
{
    // Le constructeur reçoit les options de configuration
    // (connexion string, provider, etc.)
    public AppDbContext(DbContextOptions<AppDbContext> options) 
        : base(options)
    {
    }

    // Chaque DbSet = une table dans PostgreSQL
    // Équivalent de @Entity en JPA
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Project> Projects { get; set; } = null!;
    public DbSet<TaskItem> Tasks { get; set; } = null!;

    // Configuration avancée des tables
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuration de la table Users
        modelBuilder.Entity<User>(entity =>
        {
            // Email doit être unique
            entity.HasIndex(u => u.Email).IsUnique();
            
            // Un User a plusieurs Projects
            // Si on supprime un User, ses Projects sont supprimés aussi
            entity.HasMany(u => u.Projects)
                  .WithOne(p => p.User)
                  .HasForeignKey(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuration de la table Projects
        modelBuilder.Entity<Project>(entity =>
        {
            // Un Project a plusieurs Tasks
            entity.HasMany(p => p.Tasks)
                  .WithOne(t => t.Project)
                  .HasForeignKey(t => t.ProjectId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}