using CasePortal.Api.Models.Requests;
using CasePortal.Api.Models.Responses;
using CasePortal.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasePortal.Api.Controllers;

[ApiController]
[Route("api/cases")]
[Authorize]
public class CasesController(ICaseService cases) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        var all = cases.GetAll().ToList();
        return Ok(new { data = all, total = all.Count });
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var c = cases.GetById(id);
        if (c is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Case {id} does not exist." });

        return Ok(c);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateCaseRequest request)
    {
        var created = cases.Create(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(string id, [FromBody] UpdateCaseRequest request)
    {
        var updated = cases.Update(id, request);
        if (updated is null)
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Case {id} does not exist." });

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        if (!cases.Delete(id))
            return NotFound(new ApiError { Code = "NOT_FOUND", Message = $"Case {id} does not exist." });

        return NoContent();
    }
}
