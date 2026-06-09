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
    public async Task<IActionResult> GetAll()
    {
        var all = (await memberships.GetAllAsync()).ToList();
        return Ok(new { data = all, total = all.Count });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var m = await memberships.GetByIdAsync(id);
        if (m is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Membership {id} does not exist." });

        return Ok(m);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMembershipRequest request)
    {
        var created = await memberships.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateMembershipRequest request)
    {
        var updated = await memberships.UpdateAsync(id, request);
        if (updated is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Membership {id} does not exist." });

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (!await memberships.DeleteAsync(id))
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Membership {id} does not exist." });

        return NoContent();
    }
}
