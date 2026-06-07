namespace CasePortal.Api.Services;

public interface IAuthService
{
    string? Login(string email, string password);
}
