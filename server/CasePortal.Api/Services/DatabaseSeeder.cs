using CasePortal.Api.Data;
using CasePortal.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CasePortal.Api.Services;

public class DatabaseSeeder(CasePortalDbContext db)
{
    public async Task SeedAsync()
    {
        if (!await db.Companies.AnyAsync())
        {
            db.Companies.Add(new Company
            {
                Id          = "CO-001",
                Name        = "Default Company",
                Code        = "DEFAULT",
                IsActive    = true,
                CreatedDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            });
            await db.SaveChangesAsync();
        }

        if (!await db.Users.AnyAsync())
        {
            db.Users.Add(new User
            {
                Id           = "U-001",
                Email        = "admin@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                Name         = "Administrator",
                Role         = "Admin",
                IsActive     = true,
                CompanyId    = "CO-001",
                CreatedDate  = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            });
            await db.SaveChangesAsync();
        }
    }
}
