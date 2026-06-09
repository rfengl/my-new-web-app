using CasePortal.Api.Data;
using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;
using Microsoft.EntityFrameworkCore;

namespace CasePortal.Api.Services;

public class SubmissionService(CasePortalDbContext db) : ISubmissionService
{
    public async Task<SubmissionGL?> GetByIdAsync(int id)
        => await db.SubmissionsGL.FindAsync(id);

    public async Task<SubmissionGL?> CreateAsync(int membershipId, CreateSubmissionRequest req, int userId)
    {
        var membership = await db.Memberships.FindAsync(membershipId);
        if (membership is null) return null;

        var now = DateTime.UtcNow;
        var s = new SubmissionGL
        {
            MembershipId         = membershipId,
            SubmissionStatus     = req.SubmissionStatus,
            RequestType          = req.RequestType,
            GlType               = req.GlType,
            Mrn                  = req.Mrn,
            BillingDate          = ParseDate(req.BillingDate),
            DateOfAdmission      = ParseDate(req.DateOfAdmission),
            DateOfDischarge      = ParseDate(req.DateOfDischarge),
            DoctorName           = req.DoctorName,
            DoctorSpecialty      = req.DoctorSpecialty,
            ProvisionalDiagnosis = req.ProvisionalDiagnosis,
            IcdCode              = req.IcdCode,
            EstimatedCost        = req.EstimatedCost,
            CreatedDate          = now,
            CreatedBy            = userId,
            ModifiedDate         = now,
            ModifiedBy           = userId,
        };

        db.SubmissionsGL.Add(s);
        await db.SaveChangesAsync();
        membership.SubmissionId = s.Id;
        await db.SaveChangesAsync();
        return s;
    }

    public async Task<SubmissionGL?> UpdateAsync(int id, UpdateSubmissionRequest req, int userId)
    {
        var s = await db.SubmissionsGL.FindAsync(id);
        if (s is null) return null;

        if (req.SubmissionStatus     is not null) s.SubmissionStatus     = req.SubmissionStatus;
        if (req.RequestType          is not null) s.RequestType          = req.RequestType;
        if (req.GlType               is not null) s.GlType               = req.GlType.Value;
        if (req.Mrn                  is not null) s.Mrn                  = req.Mrn;
        if (req.BillingDate          is not null) s.BillingDate          = ParseDate(req.BillingDate);
        if (req.DateOfAdmission      is not null) s.DateOfAdmission      = ParseDate(req.DateOfAdmission);
        if (req.DateOfDischarge      is not null) s.DateOfDischarge      = ParseDate(req.DateOfDischarge);
        if (req.DoctorName           is not null) s.DoctorName           = req.DoctorName;
        if (req.DoctorSpecialty      is not null) s.DoctorSpecialty      = req.DoctorSpecialty;
        if (req.ProvisionalDiagnosis is not null) s.ProvisionalDiagnosis = req.ProvisionalDiagnosis;
        if (req.IcdCode              is not null) s.IcdCode              = req.IcdCode;
        if (req.EstimatedCost        is not null) s.EstimatedCost        = req.EstimatedCost.Value;

        s.ModifiedDate = DateTime.UtcNow;
        s.ModifiedBy   = userId;

        await db.SaveChangesAsync();
        return s;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var s = await db.SubmissionsGL.FindAsync(id);
        if (s is null) return false;
        db.SubmissionsGL.Remove(s);
        await db.SaveChangesAsync();
        return true;
    }

    private static DateOnly? ParseDate(string? value) =>
        DateOnly.TryParse(value, out var d) ? d : null;
}
