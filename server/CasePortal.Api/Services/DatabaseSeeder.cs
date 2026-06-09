using CasePortal.Api.Data;
using CasePortal.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CasePortal.Api.Services;

public class DatabaseSeeder(CasePortalDbContext db)
{
    public async Task SeedAsync()
    {
        var now = DateTime.UtcNow;

        // 1. Seed user roles first (E_UserRole has no FK on CreatedBy, so order is safe)
        if (!await db.UserRoles.AnyAsync())
        {
            db.UserRoles.AddRange(
                new UserRole { Id = 1, Code = "ANON",  Name = "Anonymous", CreatedDate = now, CreatedBy = 0, ModifiedDate = now, ModifiedBy = 0 },
                new UserRole { Id = 2, Code = "ADMIN", Name = "Admin",     CreatedDate = now, CreatedBy = 0, ModifiedDate = now, ModifiedBy = 0 },
                new UserRole { Id = 3, Code = "USER",  Name = "User",      CreatedDate = now, CreatedBy = 0, ModifiedDate = now, ModifiedBy = 0 }
            );
            await db.SaveChangesAsync();
        }

        // 2. Insert Anonymous user (Id=0) via raw SQL — must exist before Company/Admin are seeded
        //    because their CreatedBy FK references T_User.Id.
        if (!await db.Users.AnyAsync(u => u.Id == 0))
        {
            await db.Database.ExecuteSqlRawAsync(@"
                SET IDENTITY_INSERT [dbo].[T_User] ON;
                INSERT INTO [dbo].[T_User]
                    ([Id], [Email], [PasswordHash], [Name], [RoleId], [IsActive],
                     [CreatedDate], [CreatedBy], [ModifiedDate], [ModifiedBy], [CompanyId])
                VALUES
                    (0, 'anonymous@system', '', 'Anonymous', 1, 0,
                     GETUTCDATE(), 0, GETUTCDATE(), 0, NULL);
                SET IDENTITY_INSERT [dbo].[T_User] OFF;");
        }

        // 3. Seed default company
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

        // 4. Seed admin user
        if (!await db.Users.AnyAsync(u => u.Email == "admin@example.com"))
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
