using CasePortal.Api.Models.Requests;
using CasePortal.Api.Models.Responses;
using CasePortal.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasePortal.Api.Controllers;

[ApiController]
[Route("api/memberships/{membershipId}/submissions")]
[Authorize]
public class SubmissionsController(ISubmissionService submissions) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll(string membershipId)
    {
        var all = submissions.GetAll(membershipId).ToList();
        return Ok(all);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string membershipId, string id)
    {
        var s = submissions.GetById(membershipId, id);
        if (s is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Submission {id} does not exist." });

        return Ok(s);
    }

    [HttpPost]
    public IActionResult Create(string membershipId, [FromBody] CreateSubmissionRequest request)
    {
        var created = submissions.Create(membershipId, request);
        if (created is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Membership {membershipId} does not exist." });

        return CreatedAtAction(nameof(GetById), new { membershipId, id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(string membershipId, string id, [FromBody] UpdateSubmissionRequest request)
    {
        var updated = submissions.Update(membershipId, id, request);
        if (updated is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Submission {id} does not exist." });

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string membershipId, string id)
    {
        if (!submissions.Delete(membershipId, id))
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Submission {id} does not exist." });

        return NoContent();
    }
}
