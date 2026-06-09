using CasePortal.Api.Data;
using CasePortal.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CasePortal.Api.Services;

public class DatabaseSeeder(CasePortalDbContext db)
{
    public async Task SeedAsync()
    {
        var now = DateTime.UtcNow;

        // Seed user roles
        if (!await db.UserRoles.AnyAsync())
        {
            db.UserRoles.AddRange(
                new UserRole { Id = 1, Code = "ANON",  Name = "Anonymous", CreatedDate = now, CreatedBy = 0, ModifiedDate = now, ModifiedBy = 0 },
                new UserRole { Id = 2, Code = "ADMIN", Name = "Admin",     CreatedDate = now, CreatedBy = 0, ModifiedDate = now, ModifiedBy = 0 },
                new UserRole { Id = 3, Code = "USER",  Name = "User",      CreatedDate = now, CreatedBy = 0, ModifiedDate = now, ModifiedBy = 0 }
            );
            await db.SaveChangesAsync();
        }

        // Seed default company
        Company company;
        if (!await db.Companies.AnyAsync())
        {
            company = new Company
            {
                Name         = "Default Company",
                Code         = "DEFAULT",
                IsActive     = true,
                CreatedDate  = now,
                CreatedBy    = 0,
                ModifiedDate = now,
                ModifiedBy   = 0,
            };
            db.Companies.Add(company);
            await db.SaveChangesAsync();
        }
        else
        {
            company = await db.Companies.FirstAsync();
        }

        // Seed admin user
        if (!await db.Users.AnyAsync())
        {
            var adminRole = await db.UserRoles.FirstAsync(r => r.Name == "Admin");
            db.Users.Add(new User
            {
                Email        = "admin@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                Name         = "Administrator",
                RoleId       = adminRole.Id,
                IsActive     = true,
                CompanyId    = company.Id,
                CreatedDate  = now,
                CreatedBy    = 0,
                ModifiedDate = now,
                ModifiedBy   = 0,
            });
            await db.SaveChangesAsync();
        }
    }
}
