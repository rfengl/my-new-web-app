using CasePortal.Api.Models.Requests;
using CasePortal.Api.Models.Responses;
using CasePortal.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasePortal.Api.Controllers;

[ApiController]
[Route("api/submissions")]
[Authorize]
public class SubmissionsController(ISubmissionService submissions, IIdEncryptionService enc) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        if (!TryDecrypt(id, out var rawId))
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = "Submission not found." });

        var s = await submissions.GetByIdAsync(rawId);
        if (s is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = "Submission not found." });

        return Ok(ToResponse(s));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSubmissionRequest request)
    {
        if (!TryDecrypt(request.MembershipId, out var membershipId))
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = "Membership not found." });

        var created = await submissions.CreateAsync(membershipId, request);
        if (created is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = "Membership not found." });

        var response = ToResponse(created);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateSubmissionRequest request)
    {
        if (!TryDecrypt(id, out var rawId))
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = "Submission not found." });

        var updated = await submissions.UpdateAsync(rawId, request);
        if (updated is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = "Submission not found." });

        return Ok(ToResponse(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!TryDecrypt(id, out var rawId))
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = "Submission not found." });

        if (!await submissions.DeleteAsync(rawId))
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = "Submission not found." });

        return NoContent();
    }

    private SubmissionResponse ToResponse(Models.SubmissionGL s) => new(
        enc.Encrypt(s.Id),
        enc.Encrypt(s.MembershipId),
        s.SubmissionStatus, s.RequestType, s.GlType, s.DisplayStatus, s.Mrn,
        s.BillingDate, s.DateOfAdmission, s.DateOfDischarge,
        s.DoctorName, s.DoctorSpecialty, s.ProvisionalDiagnosis,
        s.IcdCode, s.EstimatedCost, s.CreatedDate
    );

    private bool TryDecrypt(string token, out int id)
    {
        try   { id = enc.Decrypt(token); return true; }
        catch { id = 0;                  return false; }
    }
}
