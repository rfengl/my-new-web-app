using CasePortal.Api.Models.Requests;
using CasePortal.Api.Models.Responses;
using CasePortal.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasePortal.Api.Controllers;

[ApiController]
[Route("api/memberships")]
[Authorize]
public class MembershipsController(IMembershipService memberships) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        var all = memberships.GetAll().ToList();
        return Ok(new { data = all, total = all.Count });
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var m = memberships.GetById(id);
        if (m is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Membership {id} does not exist." });

        return Ok(m);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateMembershipRequest request)
    {
        var created = memberships.Create(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(string id, [FromBody] UpdateMembershipRequest request)
    {
        var updated = memberships.Update(id, request);
        if (updated is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Membership {id} does not exist." });

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        if (!memberships.Delete(id))
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Membership {id} does not exist." });

        return NoContent();
    }
}
