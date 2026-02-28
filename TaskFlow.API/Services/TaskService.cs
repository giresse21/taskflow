using TaskFlow.API.DTOs.Task;
using TaskFlow.API.Models;
using TaskFlow.API.Repositories.Interfaces;
using TaskFlow.API.Services.Interfaces;

namespace TaskFlow.API.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    private readonly IProjectRepository _projectRepository;

    public TaskService(ITaskRepository taskRepository, IProjectRepository projectRepository)
    {
        _taskRepository = taskRepository;
        _projectRepository = projectRepository;
    }

    // Vérifie que le projet appartient à l'utilisateur
    private async Task<bool> ProjectBelongsToUser(int projectId, int userId)
    {
        var project = await _projectRepository.GetByIdAsync(projectId);
        return project != null && project.UserId == userId;
    }

    public async Task<List<TaskResponseDto>> GetAllAsync(int projectId, int userId)
    {
        // Vérifie que le projet appartient à l'utilisateur
        if (!await ProjectBelongsToUser(projectId, userId))
            return new List<TaskResponseDto>();

        var tasks = await _taskRepository.GetAllByProjectIdAsync(projectId);
        return tasks.Select(t => ToDto(t)).ToList();
    }

    public async Task<TaskResponseDto?> GetByIdAsync(int id, int projectId, int userId)
    {
        if (!await ProjectBelongsToUser(projectId, userId))
            return null;

        var task = await _taskRepository.GetByIdAsync(id);
        if (task == null || task.ProjectId != projectId)
            return null;

        return ToDto(task);
    }

    public async Task<TaskResponseDto> CreateAsync(CreateTaskDto dto, int projectId, int userId)
    {
        if (!await ProjectBelongsToUser(projectId, userId))
            throw new Exception("Projet non trouvé");

        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
          // Convertit en UTC si la date existe
    DueDate = dto.DueDate.HasValue
        ? DateTime.SpecifyKind(dto.DueDate.Value, DateTimeKind.Utc)
        : null,
            ProjectId = projectId
        };

        var created = await _taskRepository.AddAsync(task);
        return ToDto(created);
    }

    public async Task<TaskResponseDto?> UpdateAsync(int id, CreateTaskDto dto, int projectId, int userId)
    {
        if (!await ProjectBelongsToUser(projectId, userId))
            return null;

        var task = await _taskRepository.GetByIdAsync(id);
        if (task == null || task.ProjectId != projectId)
            return null;

        task.Title = dto.Title;
        task.Description = dto.Description;
task.DueDate = dto.DueDate.HasValue
    ? DateTime.SpecifyKind(dto.DueDate.Value, DateTimeKind.Utc)
    : null;
        var updated = await _taskRepository.UpdateAsync(task);
        return ToDto(updated);
    }

    // Toggle — complété ou non complété
    public async Task<TaskResponseDto?> ToggleCompleteAsync(int id, int projectId, int userId)
    {
        if (!await ProjectBelongsToUser(projectId, userId))
            return null;

        var task = await _taskRepository.GetByIdAsync(id);
        if (task == null || task.ProjectId != projectId)
            return null;

        // Inverse l'état — true devient false, false devient true
        task.IsCompleted = !task.IsCompleted;

        var updated = await _taskRepository.UpdateAsync(task);
        return ToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id, int projectId, int userId)
    {
        if (!await ProjectBelongsToUser(projectId, userId))
            return false;

        var task = await _taskRepository.GetByIdAsync(id);
        if (task == null || task.ProjectId != projectId)
            return false;

        await _taskRepository.DeleteAsync(task);
        return true;
    }

    private TaskResponseDto ToDto(TaskItem task)
    {
        return new TaskResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            IsCompleted = task.IsCompleted,
            CreatedAt = task.CreatedAt,
            DueDate = task.DueDate,
            ProjectId = task.ProjectId
        };
    }
}