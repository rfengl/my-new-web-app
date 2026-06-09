using CasePortal.Api.Data;
using CasePortal.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CasePortal.Api.Services;

public class DatabaseSeeder(CasePortalDbContext db)
{
    public async Task SeedAsync()
    {
        Company company;
        if (!await db.Companies.AnyAsync())
        {
            company = new Company
            {
                Name        = "Default Company",
                Code        = "DEFAULT",
                IsActive    = true,
                CreatedDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            };
            db.Companies.Add(company);
            await db.SaveChangesAsync();
        }
        else
        {
            company = await db.Companies.FirstAsync();
        }

        if (!await db.Users.AnyAsync())
        {
            db.Users.Add(new User
            {
                Email        = "admin@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                Name         = "Administrator",
                Role         = "Admin",
                IsActive     = true,
                CompanyId    = company.Id,
                CreatedDate  = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            });
            await db.SaveChangesAsync();
        }
    }
}
