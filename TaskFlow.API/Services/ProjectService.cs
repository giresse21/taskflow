using TaskFlow.API.DTOs.Project;
using TaskFlow.API.Models;
using TaskFlow.API.Repositories.Interfaces;
using TaskFlow.API.Services.Interfaces;

namespace TaskFlow.API.Services;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _repository;

    public ProjectService(IProjectRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ProjectResponseDto>> GetAllAsync(int userId)
    {
        var projects = await _repository.GetAllByUserIdAsync(userId);
        
        // Convertir les Models en DTOs
        return projects.Select(p => ToDto(p)).ToList();
    }

    public async Task<ProjectResponseDto?> GetByIdAsync(int id, int userId)
    {
        var project = await _repository.GetByIdAsync(id);

        // Vérifier que le projet existe ET appartient à l'utilisateur
        if (project == null || project.UserId != userId)
            return null;

        return ToDto(project);
    }

    public async Task<ProjectResponseDto> CreateAsync(CreateProjectDto dto, int userId)
    {
        var project = new Project
        {
            Name = dto.Name,
            Description = dto.Description,
            UserId = userId
        };

        var created = await _repository.AddAsync(project);
        return ToDto(created);
    }

    public async Task<ProjectResponseDto?> UpdateAsync(int id, CreateProjectDto dto, int userId)
    {
        var project = await _repository.GetByIdAsync(id);

        if (project == null || project.UserId != userId)
            return null;

        project.Name = dto.Name;
        project.Description = dto.Description;

        var updated = await _repository.UpdateAsync(project);
        return ToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id, int userId)
    {
        var project = await _repository.GetByIdAsync(id);

        if (project == null || project.UserId != userId)
            return false;

        await _repository.DeleteAsync(project);
        return true;
    }

    // Méthode privée pour convertir Model → DTO
    private ProjectResponseDto ToDto(Project project)
    {
        return new ProjectResponseDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            CreatedAt = project.CreatedAt,
            UserId = project.UserId
        };
    }
}