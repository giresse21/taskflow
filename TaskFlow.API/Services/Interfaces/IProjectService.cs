using TaskFlow.API.DTOs.Project;

namespace TaskFlow.API.Services.Interfaces;

public interface IProjectService
{
    Task<List<ProjectResponseDto>> GetAllAsync(int userId);
    Task<ProjectResponseDto?> GetByIdAsync(int id, int userId);
    Task<ProjectResponseDto> CreateAsync(CreateProjectDto dto, int userId);
    Task<ProjectResponseDto?> UpdateAsync(int id, CreateProjectDto dto, int userId);
    Task<bool> DeleteAsync(int id, int userId);
}