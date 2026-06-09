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
    public IActionResult GetById(string id)
    {
        var s = submissions.GetById(id);
        if (s is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Submission {id} does not exist." });

        return Ok(s);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateSubmissionRequest request)
    {
        var created = submissions.Create(request);
        if (created is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Membership {request.MembershipId} does not exist." });

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(string id, [FromBody] UpdateSubmissionRequest request)
    {
        var updated = submissions.Update(id, request);
        if (updated is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Submission {id} does not exist." });

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        if (!submissions.Delete(id))
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Submission {id} does not exist." });

        return NoContent();
    }
}
