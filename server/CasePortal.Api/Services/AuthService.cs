using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace CasePortal.Api.Services;

public class AuthService : IAuthService
{
    private readonly IConfiguration _config;

    // Hardcoded for demo — replace with a real user store / identity provider
    private const string DemoEmail    = "admin@example.com";
    private const string DemoPassword = "password123";

    public AuthService(IConfiguration config) => _config = config;

    public string? Login(string email, string password)
    {
        if (!email.Equals(DemoEmail, StringComparison.OrdinalIgnoreCase) || password != DemoPassword)
            return null;

        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer:             _config["Jwt:Issuer"],
            audience:           _config["Jwt:Audience"],
            claims:             [new Claim(ClaimTypes.Email, email)],
            expires:            DateTime.UtcNow.AddSeconds(86400),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
