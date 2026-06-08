namespace CasePortal.Api.Models;

public class SubmissionGL
{
    public string Id               { get; set; } = string.Empty;
    public string MembershipId     { get; set; } = string.Empty;
    public string SubmissionStatus { get; set; } = string.Empty;
    public string RequestType      { get; set; } = string.Empty;
    public int    GlType           { get; set; }
    public string Mrn              { get; set; } = string.Empty;
    public string CreatedDate      { get; set; } = string.Empty;
}
