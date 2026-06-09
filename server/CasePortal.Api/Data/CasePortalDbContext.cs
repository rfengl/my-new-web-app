using CasePortal.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CasePortal.Api.Data;

public class CasePortalDbContext(DbContextOptions<CasePortalDbContext> options) : DbContext(options)
{
    public DbSet<Company>      Companies     => Set<Company>();
    public DbSet<Membership>   Memberships   => Set<Membership>();
    public DbSet<SubmissionGL> SubmissionsGL => Set<SubmissionGL>();
    public DbSet<User>         Users         => Set<User>();

    protected override void OnModelCreating(ModelBuilder model)
    {
        model.HasDefaultSchema("dbo");

        model.Entity<Company>(e =>
        {
            e.ToTable("T_Company");
            e.HasKey(c => c.Id);
            e.Property(c => c.Id)         .ValueGeneratedOnAdd();
            e.Property(c => c.Name)        .HasMaxLength(200).IsRequired();
            e.Property(c => c.Code)        .HasMaxLength(50);
            e.Property(c => c.CreatedDate) .HasColumnType("date");
        });

        model.Entity<Membership>(e =>
        {
            e.ToTable("T_Membership");
            e.HasKey(m => m.Id);
            e.Property(m => m.Id)                    .ValueGeneratedOnAdd();
            e.Property(m => m.Date)                  .HasColumnType("date");
            e.Property(m => m.Name)                  .HasMaxLength(200).IsRequired();
            e.Property(m => m.IdType)                 .HasMaxLength(20).HasDefaultValue("NRIC");
            e.Property(m => m.IdNo)                   .HasMaxLength(30);
            e.Property(m => m.Insurance)              .HasMaxLength(100);
            e.Property(m => m.Company)                .HasMaxLength(200);
            e.Property(m => m.PolicyNo)               .HasMaxLength(50);
            e.Property(m => m.RbEntitlement)          .HasColumnType("decimal(18,2)");
            e.Property(m => m.CoPayment)              .HasColumnType("decimal(18,2)");
            e.Property(m => m.CoInsurance)            .HasMaxLength(50);
            e.Property(m => m.Deductible)             .HasColumnType("decimal(18,2)");
            e.Property(m => m.PolicyEffDate)          .HasColumnType("date");
            e.Property(m => m.PolicyExpDate)          .HasColumnType("date");
            e.Property(m => m.PolicyLapseDate)        .HasColumnType("date");
            e.Property(m => m.Status)                 .HasMaxLength(50).HasDefaultValue("Inforce");
            e.Property(m => m.UnderwritingExclusion)  .HasMaxLength(500);
        });

        model.Entity<User>(e =>
        {
            e.ToTable("T_User");
            e.HasKey(u => u.Id);
            e.Property(u => u.Id)           .ValueGeneratedOnAdd();
            e.Property(u => u.Email)         .HasMaxLength(200).IsRequired();
            e.Property(u => u.PasswordHash)  .HasMaxLength(500).IsRequired();
            e.Property(u => u.Name)          .HasMaxLength(200).IsRequired();
            e.Property(u => u.Role)          .HasMaxLength(50).HasDefaultValue("User");
            e.Property(u => u.CreatedDate)   .HasColumnType("date");
            e.HasIndex(u => u.Email).IsUnique();
            e.HasOne<Company>()
             .WithMany()
             .HasForeignKey(u => u.CompanyId)
             .OnDelete(DeleteBehavior.SetNull);
        });

        model.Entity<SubmissionGL>(e =>
        {
            e.ToTable("T_SubmissionGL");
            e.HasKey(s => s.Id);
            e.Property(s => s.Id)                    .ValueGeneratedOnAdd();
            e.Property(s => s.MembershipId)           .IsRequired();
            e.Property(s => s.SubmissionStatus)       .HasMaxLength(50);
            e.Property(s => s.RequestType)            .HasMaxLength(100);
            e.Property(s => s.Mrn)                    .HasMaxLength(50);
            e.Property(s => s.BillingDate)            .HasColumnType("date");
            e.Property(s => s.DateOfAdmission)        .HasColumnType("date");
            e.Property(s => s.DateOfDischarge)        .HasColumnType("date");
            e.Property(s => s.DoctorName)             .HasMaxLength(200);
            e.Property(s => s.DoctorSpecialty)        .HasMaxLength(100);
            e.Property(s => s.ProvisionalDiagnosis)   .HasMaxLength(500);
            e.Property(s => s.IcdCode)                .HasMaxLength(20);
            e.Property(s => s.EstimatedCost)          .HasColumnType("decimal(18,2)");
            e.Property(s => s.CreatedDate)            .HasColumnType("date");
            e.Ignore(s => s.DisplayStatus);
            e.HasOne<Membership>()
             .WithMany()
             .HasForeignKey(s => s.MembershipId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
