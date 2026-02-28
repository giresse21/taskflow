namespace TaskFlow.API.Models;

// On appelle TaskItem et pas Task
// parce que Task existe déjà en C# (async/await)
public class TaskItem
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DueDate { get; set; }

    // Clé étrangère vers Project
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
}