using TaskFlow.API.Models;

namespace TaskFlow.API.Repositories.Interfaces;

public interface ITaskRepository
{
    Task<List<TaskItem>> GetAllByProjectIdAsync(int projectId);
    Task<TaskItem?> GetByIdAsync(int id);
    Task<TaskItem> AddAsync(TaskItem task);
    Task<TaskItem> UpdateAsync(TaskItem task);
    Task DeleteAsync(TaskItem task);
}