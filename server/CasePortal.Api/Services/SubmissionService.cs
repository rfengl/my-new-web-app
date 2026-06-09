using CasePortal.Api.Data;
using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;
using Microsoft.EntityFrameworkCore;

namespace CasePortal.Api.Services;

public class SubmissionService(CasePortalDbContext db) : ISubmissionService
{
    public async Task<SubmissionGL?> GetByIdAsync(string id)
        => await db.SubmissionsGL.FindAsync(id);

    public async Task<SubmissionGL?> CreateAsync(CreateSubmissionRequest req)
    {
        var membership = await db.Memberships.FindAsync(req.MembershipId);
        if (membership is null) return null;

        var nextId = await NextSubmissionIdAsync();
        var s = new SubmissionGL
        {
            Id                   = nextId,
            MembershipId         = req.MembershipId,
            SubmissionStatus     = req.SubmissionStatus,
            RequestType          = req.RequestType,
            GlType               = req.GlType,
            Mrn                  = req.Mrn,
            BillingDate          = req.BillingDate,
            DateOfAdmission      = req.DateOfAdmission,
            DateOfDischarge      = req.DateOfDischarge,
            DoctorName           = req.DoctorName,
            DoctorSpecialty      = req.DoctorSpecialty,
            ProvisionalDiagnosis = req.ProvisionalDiagnosis,
            IcdCode              = req.IcdCode,
            EstimatedCost        = req.EstimatedCost,
            CreatedDate          = DateTime.UtcNow.ToString("yyyy-MM-dd"),
        };

        db.SubmissionsGL.Add(s);
        membership.SubmissionId = s.Id;
        await db.SaveChangesAsync();
        return s;
    }

    public async Task<SubmissionGL?> UpdateAsync(string id, UpdateSubmissionRequest req)
    {
        var s = await db.SubmissionsGL.FindAsync(id);
        if (s is null) return null;

        if (req.SubmissionStatus     is not null) s.SubmissionStatus     = req.SubmissionStatus;
        if (req.RequestType          is not null) s.RequestType          = req.RequestType;
        if (req.GlType               is not null) s.GlType               = req.GlType.Value;
        if (req.Mrn                  is not null) s.Mrn                  = req.Mrn;
        if (req.BillingDate          is not null) s.BillingDate          = req.BillingDate;
        if (req.DateOfAdmission      is not null) s.DateOfAdmission      = req.DateOfAdmission;
        if (req.DateOfDischarge      is not null) s.DateOfDischarge      = req.DateOfDischarge;
        if (req.DoctorName           is not null) s.DoctorName           = req.DoctorName;
        if (req.DoctorSpecialty      is not null) s.DoctorSpecialty      = req.DoctorSpecialty;
        if (req.ProvisionalDiagnosis is not null) s.ProvisionalDiagnosis = req.ProvisionalDiagnosis;
        if (req.IcdCode              is not null) s.IcdCode              = req.IcdCode;
        if (req.EstimatedCost        is not null) s.EstimatedCost        = req.EstimatedCost.Value;

        await db.SaveChangesAsync();
        return s;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var s = await db.SubmissionsGL.FindAsync(id);
        if (s is null) return false;
        db.SubmissionsGL.Remove(s);
        await db.SaveChangesAsync();
        return true;
    }

    private async Task<string> NextSubmissionIdAsync()
    {
        var ids = await db.SubmissionsGL.Select(s => s.Id).ToListAsync();
        var max = ids
            .Select(id => int.TryParse(id.Replace("GL-", ""), out var n) ? n : 0)
            .DefaultIfEmpty(0)
            .Max();
        return $"GL-{(max + 1):D3}";
    }
}
