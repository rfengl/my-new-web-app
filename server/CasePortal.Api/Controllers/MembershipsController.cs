using CasePortal.Api.Models.Requests;
using CasePortal.Api.Models.Responses;
using CasePortal.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasePortal.Api.Controllers;

[ApiController]
[Route("api/memberships")]
[Authorize]
public class MembershipsController(IMembershipService memberships, IIdEncryptionService enc, IDateFormatter dates) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var all = (await memberships.GetAllAsync()).Select(ToResponse).ToList();
        return Ok(new { data = all, total = all.Count });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        if (!TryDecrypt(id, out var rawId))
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = "Membership not found." });

        var m = await memberships.GetByIdAsync(rawId);
        if (m is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = "Membership not found." });

        return Ok(ToResponse(m));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMembershipRequest request)
    {
        var created  = await memberships.CreateAsync(request);
        var response = ToResponse(created);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateMembershipRequest request)
    {
        if (!TryDecrypt(id, out var rawId))
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = "Membership not found." });

        var updated = await memberships.UpdateAsync(rawId, request);
        if (updated is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = "Membership not found." });

        return Ok(ToResponse(updated));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!TryDecrypt(id, out var rawId))
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = "Membership not found." });

        if (!await memberships.DeleteAsync(rawId))
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = "Membership not found." });

        return NoContent();
    }

    private MembershipResponse ToResponse(Models.Membership m) => new(
        enc.Encrypt(m.Id),
        dates.Format(m.Date),
        m.Name, m.IdType, m.IdNo,
        m.Insurance, m.Company, m.PolicyNo,
        m.RbEntitlement, m.CoPayment, m.CoInsurance, m.Deductible,
        dates.Format(m.PolicyEffDate),
        dates.Format(m.PolicyExpDate),
        dates.Format(m.PolicyLapseDate),
        m.Status, m.UnderwritingExclusion,
        m.SubmissionId.HasValue ? enc.Encrypt(m.SubmissionId.Value) : null
    );

    private bool TryDecrypt(string token, out int id)
    {
        try   { id = enc.Decrypt(token); return true; }
        catch { id = 0;                  return false; }
    }
}
