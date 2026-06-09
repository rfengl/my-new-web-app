namespace CasePortal.Api.Models.Requests;

public class CreateSubmissionRequest
{
    public string  MembershipId         { get; set; } = string.Empty;
    public string  SubmissionStatus     { get; set; } = string.Empty;
    public string  RequestType          { get; set; } = string.Empty;
    public int     GlType               { get; set; }
    public string  Mrn                  { get; set; } = string.Empty;
    public string  BillingDate          { get; set; } = string.Empty;
    public string  DateOfAdmission      { get; set; } = string.Empty;
    public string  DateOfDischarge      { get; set; } = string.Empty;
    public string  DoctorName           { get; set; } = string.Empty;
    public string  DoctorSpecialty      { get; set; } = string.Empty;
    public string  ProvisionalDiagnosis { get; set; } = string.Empty;
    public string  IcdCode              { get; set; } = string.Empty;
    public decimal EstimatedCost        { get; set; }
}
