namespace CasePortal.Api.Services;

public interface IAuthService
{
    Task<string?> LoginAsync(string email, string password);
}
