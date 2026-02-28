namespace TaskFlow.API.Models;

public class Project
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Clé étrangère vers User
    // Équivalent @ManyToOne en JPA
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    // Un Project a plusieurs Tasks
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}