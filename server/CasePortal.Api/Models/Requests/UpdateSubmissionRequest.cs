namespace CasePortal.Api.Models.Requests;

public class UpdateSubmissionRequest
{
    public string?  SubmissionStatus     { get; set; }
    public string?  RequestType          { get; set; }
    public int?     GlType               { get; set; }
    public string?  Mrn                  { get; set; }
    public string?  BillingDate          { get; set; }
    public string?  DateOfAdmission      { get; set; }
    public string?  DateOfDischarge      { get; set; }
    public string?  DoctorName           { get; set; }
    public string?  DoctorSpecialty      { get; set; }
    public string?  ProvisionalDiagnosis { get; set; }
    public string?  IcdCode              { get; set; }
    public decimal? EstimatedCost        { get; set; }
}
