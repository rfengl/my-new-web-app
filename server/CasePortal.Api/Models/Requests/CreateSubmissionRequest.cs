namespace CasePortal.Api.Models.Requests;

public class CreateSubmissionRequest
{
    public string MembershipId     { get; set; } = string.Empty;
    public string SubmissionStatus { get; set; } = string.Empty;
    public string RequestType      { get; set; } = string.Empty;
    public int    GlType           { get; set; }
    public string Mrn              { get; set; } = string.Empty;
}
