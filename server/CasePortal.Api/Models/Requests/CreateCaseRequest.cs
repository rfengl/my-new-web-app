using System.ComponentModel.DataAnnotations;

namespace CasePortal.Api.Models.Requests;

public class CreateCaseRequest
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public string Status { get; set; } = "Open";

    [Required]
    public string Priority { get; set; } = "Medium";
}
