using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CasePortal.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CasePortal.Api.Services;

public class AuthService(CasePortalDbContext db, IConfiguration config) : IAuthService
{
    public async Task<string?> LoginAsync(string email, string password)
    {
        var user = await db.Users.FirstOrDefaultAsync(u =>
            u.Email.ToLower() == email.ToLower() && u.IsActive);

        if (user is null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            return null;

        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer:             config["Jwt:Issuer"],
            audience:           config["Jwt:Audience"],
            claims:             [
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email,          user.Email),
                new Claim(ClaimTypes.Name,           user.Name),
                new Claim(ClaimTypes.Role,           user.Role),
            ],
            expires:            DateTime.UtcNow.AddSeconds(86400),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
