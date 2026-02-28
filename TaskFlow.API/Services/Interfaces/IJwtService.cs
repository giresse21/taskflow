using TaskFlow.API.Models;

namespace TaskFlow.API.Services.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}