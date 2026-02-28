using TaskFlow.API.Models;

namespace TaskFlow.API.Repositories.Interfaces;

public interface IProjectRepository
{
    Task<List<Project>> GetAllByUserIdAsync(int userId);
    Task<Project?> GetByIdAsync(int id);
    Task<Project> AddAsync(Project project);
    Task<Project> UpdateAsync(Project project);
    Task DeleteAsync(Project project);
}