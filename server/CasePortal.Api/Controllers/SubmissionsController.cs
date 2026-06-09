using CasePortal.Api.Models.Requests;
using CasePortal.Api.Models.Responses;
using CasePortal.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasePortal.Api.Controllers;

[ApiController]
[Route("api/submissions")]
[Authorize]
public class SubmissionsController(ISubmissionService submissions) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var s = await submissions.GetByIdAsync(id);
        if (s is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Submission {id} does not exist." });

        return Ok(s);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSubmissionRequest request)
    {
        var created = await submissions.CreateAsync(request);
        if (created is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Membership {request.MembershipId} does not exist." });

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateSubmissionRequest request)
    {
        var updated = await submissions.UpdateAsync(id, request);
        if (updated is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Submission {id} does not exist." });

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!await submissions.DeleteAsync(id))
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Submission {id} does not exist." });

        return NoContent();
    }
}
