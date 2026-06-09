using CasePortal.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CasePortal.Api.Data;

public class CasePortalDbContext(DbContextOptions<CasePortalDbContext> options) : DbContext(options)
{
    public DbSet<Membership>   Memberships   => Set<Membership>();
    public DbSet<SubmissionGL> SubmissionsGL => Set<SubmissionGL>();
    public DbSet<User>         Users         => Set<User>();

    protected override void OnModelCreating(ModelBuilder model)
    {
        model.HasDefaultSchema("dbo");

        model.Entity<Membership>(e =>
        {
            e.ToTable("T_Membership");
            e.HasKey(m => m.Id);
            e.Property(m => m.Id)                    .HasMaxLength(20);
            e.Property(m => m.Date)                  .HasMaxLength(10);
            e.Property(m => m.Name)                  .HasMaxLength(200).IsRequired();
            e.Property(m => m.Nric)                  .HasMaxLength(20);
            e.Property(m => m.PassportNo)             .HasMaxLength(20);
            e.Property(m => m.Insurance)              .HasMaxLength(100);
            e.Property(m => m.Company)                .HasMaxLength(200);
            e.Property(m => m.PolicyNo)               .HasMaxLength(50);
            e.Property(m => m.RbEntitlement)          .HasColumnType("decimal(18,2)");
            e.Property(m => m.CoPayment)              .HasColumnType("decimal(18,2)");
            e.Property(m => m.CoInsurance)            .HasMaxLength(50);
            e.Property(m => m.Deductible)             .HasColumnType("decimal(18,2)");
            e.Property(m => m.PolicyEffDate)          .HasMaxLength(10);
            e.Property(m => m.PolicyExpDate)          .HasMaxLength(10);
            e.Property(m => m.PolicyLapseDate)        .HasMaxLength(10);
            e.Property(m => m.Status)                 .HasMaxLength(50).HasDefaultValue("Inforce");
            e.Property(m => m.UnderwritingExclusion)  .HasMaxLength(500);
            e.Property(m => m.SubmissionId)           .HasMaxLength(20);
        });

        model.Entity<User>(e =>
        {
            e.ToTable("T_User");
            e.HasKey(u => u.Id);
            e.Property(u => u.Id)           .HasMaxLength(20);
            e.Property(u => u.Email)         .HasMaxLength(200).IsRequired();
            e.Property(u => u.PasswordHash)  .HasMaxLength(500).IsRequired();
            e.Property(u => u.Name)          .HasMaxLength(200).IsRequired();
            e.Property(u => u.Role)          .HasMaxLength(50).HasDefaultValue("User");
            e.Property(u => u.CreatedDate)   .HasMaxLength(10);
            e.HasIndex(u => u.Email).IsUnique();
        });

        model.Entity<SubmissionGL>(e =>
        {
            e.ToTable("T_SubmissionGL");
            e.HasKey(s => s.Id);
            e.Property(s => s.Id)                    .HasMaxLength(20);
            e.Property(s => s.MembershipId)           .HasMaxLength(20).IsRequired();
            e.Property(s => s.SubmissionStatus)       .HasMaxLength(50);
            e.Property(s => s.RequestType)            .HasMaxLength(100);
            e.Property(s => s.Mrn)                    .HasMaxLength(50);
            e.Property(s => s.BillingDate)            .HasMaxLength(10);
            e.Property(s => s.DateOfAdmission)        .HasMaxLength(10);
            e.Property(s => s.DateOfDischarge)        .HasMaxLength(10);
            e.Property(s => s.DoctorName)             .HasMaxLength(200);
            e.Property(s => s.DoctorSpecialty)        .HasMaxLength(100);
            e.Property(s => s.ProvisionalDiagnosis)   .HasMaxLength(500);
            e.Property(s => s.IcdCode)                .HasMaxLength(20);
            e.Property(s => s.EstimatedCost)          .HasColumnType("decimal(18,2)");
            e.Property(s => s.CreatedDate)            .HasMaxLength(10);
            e.Ignore(s => s.DisplayStatus);
        });
    }
}
