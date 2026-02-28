using TaskFlow.API.DTOs.Task;

namespace TaskFlow.API.Services.Interfaces;



public interface ITaskService
{
    Task<List<TaskResponseDto>> GetAllAsync(int projectId, int userId);
    Task<TaskResponseDto?> GetByIdAsync(int id, int projectId, int userId);
    Task<TaskResponseDto> CreateAsync(CreateTaskDto dto, int projectId, int userId);
    Task<TaskResponseDto?> UpdateAsync(int id, CreateTaskDto dto, int projectId, int userId);
    Task<TaskResponseDto?> ToggleCompleteAsync(int id, int projectId, int userId);
    Task<bool> DeleteAsync(int id, int projectId, int userId);
}