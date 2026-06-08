namespace CasePortal.Api.Models.Requests;

public class UpdateSubmissionRequest
{
    public string? SubmissionStatus { get; set; }
    public string? RequestType      { get; set; }
    public int?    GlType           { get; set; }
    public string? Mrn              { get; set; }
}
