using CasePortal.Api.Data;
using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;
using Microsoft.EntityFrameworkCore;

namespace CasePortal.Api.Services;

public class MembershipService(CasePortalDbContext db) : IMembershipService
{
    public async Task<IEnumerable<Membership>> GetAllAsync()
        => await db.Memberships.OrderByDescending(m => m.Date).ToListAsync();

    public async Task<Membership?> GetByIdAsync(int id)
        => await db.Memberships.FindAsync(id);

    public async Task<Membership> CreateAsync(CreateMembershipRequest req)
    {
        var m = new Membership
        {
            Date                  = DateOnly.FromDateTime(DateTime.UtcNow),
            Name                  = req.Name,
            IdType                = req.IdType,
            IdNo                  = req.IdNo,
            Insurance             = req.Insurance,
            Company               = req.Company,
            PolicyNo              = req.PolicyNo,
            RbEntitlement         = req.RbEntitlement,
            CoPayment             = req.CoPayment,
            CoInsurance           = req.CoInsurance,
            Deductible            = req.Deductible,
            PolicyEffDate         = ParseDate(req.PolicyEffDate),
            PolicyExpDate         = ParseDate(req.PolicyExpDate),
            PolicyLapseDate       = ParseDate(req.PolicyLapseDate),
            Status                = req.Status,
            UnderwritingExclusion = req.UnderwritingExclusion,
        };
        db.Memberships.Add(m);
        await db.SaveChangesAsync();
        return m;
    }

    public async Task<Membership?> UpdateAsync(int id, UpdateMembershipRequest req)
    {
        var m = await db.Memberships.FindAsync(id);
        if (m is null) return null;

        if (req.Name                  is not null) m.Name                  = req.Name;
        if (req.IdType                is not null) m.IdType                = req.IdType;
        if (req.IdNo                  is not null) m.IdNo                  = req.IdNo;
        if (req.Insurance             is not null) m.Insurance             = req.Insurance;
        if (req.Company               is not null) m.Company               = req.Company;
        if (req.PolicyNo              is not null) m.PolicyNo              = req.PolicyNo;
        if (req.RbEntitlement         is not null) m.RbEntitlement         = req.RbEntitlement.Value;
        if (req.CoPayment             is not null) m.CoPayment             = req.CoPayment.Value;
        if (req.CoInsurance           is not null) m.CoInsurance           = req.CoInsurance;
        if (req.Deductible            is not null) m.Deductible            = req.Deductible.Value;
        if (req.PolicyEffDate         is not null) m.PolicyEffDate         = ParseDate(req.PolicyEffDate);
        if (req.PolicyExpDate         is not null) m.PolicyExpDate         = ParseDate(req.PolicyExpDate);
        if (req.PolicyLapseDate       is not null) m.PolicyLapseDate       = ParseDate(req.PolicyLapseDate);
        if (req.Status                is not null) m.Status                = req.Status;
        if (req.UnderwritingExclusion is not null) m.UnderwritingExclusion = req.UnderwritingExclusion;

        await db.SaveChangesAsync();
        return m;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var m = await db.Memberships.FindAsync(id);
        if (m is null) return false;
        db.Memberships.Remove(m);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task SetSubmissionIdAsync(int membershipId, int submissionId)
    {
        var m = await db.Memberships.FindAsync(membershipId);
        if (m is not null)
        {
            m.SubmissionId = submissionId;
            await db.SaveChangesAsync();
        }
    }

    private static DateOnly? ParseDate(string? value) =>
        DateOnly.TryParse(value, out var d) ? d : null;
}
