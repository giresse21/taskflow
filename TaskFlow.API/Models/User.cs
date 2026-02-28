namespace TaskFlow.API.Models;

public class User
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Un User a plusieurs Projects
    // Équivalent @OneToMany en JPA
    public ICollection<Project> Projects { get; set; } = new List<Project>();
}