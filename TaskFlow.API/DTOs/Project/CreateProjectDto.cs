namespace TaskFlow.API.DTOs.Project;

public class CreateProjectDto
{
    public required string Name { get; set; }
    public string? Description { get; set; }
}