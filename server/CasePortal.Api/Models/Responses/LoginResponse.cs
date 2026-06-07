namespace CasePortal.Api.Models.Responses;

public class LoginResponse
{
    public string Token     { get; set; } = string.Empty;
    public int    ExpiresIn { get; set; }
}
