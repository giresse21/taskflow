namespace TaskFlow.API.DTOs.Auth;

// Ce qu'on renvoie au client après login/register
public class AuthResponseDto
{
    public required string Token { get; set; }
    public required string Email { get; set; }
    public string? FirstName { get; set; }
    public DateTime ExpiresAt { get; set; }
}