using System.ComponentModel.DataAnnotations;

namespace CasePortal.Api.Models.Requests;

public class UpdateCaseRequest
{
    [MaxLength(200)]
    public string? Title { get; set; }

    public string? Description { get; set; }

    public string? Status { get; set; }

    public string? Priority { get; set; }
}
