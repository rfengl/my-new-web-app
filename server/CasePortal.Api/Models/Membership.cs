namespace CasePortal.Api.Models;

public class Membership
{
    public int       Id                    { get; set; }
    public DateOnly  Date                  { get; set; }
    public string    Name                  { get; set; } = string.Empty;
    public string    Nric                  { get; set; } = string.Empty;
    public string    PassportNo            { get; set; } = string.Empty;
    public string    Insurance             { get; set; } = string.Empty;
    public string    Company               { get; set; } = string.Empty;
    public string    PolicyNo              { get; set; } = string.Empty;
    public decimal   RbEntitlement         { get; set; }
    public decimal   CoPayment             { get; set; }
    public string    CoInsurance           { get; set; } = string.Empty;
    public decimal   Deductible            { get; set; }
    public DateOnly? PolicyEffDate         { get; set; }
    public DateOnly? PolicyExpDate         { get; set; }
    public DateOnly? PolicyLapseDate       { get; set; }
    public string    Status                { get; set; } = "Inforce";
    public string    UnderwritingExclusion { get; set; } = string.Empty;
    public int?      SubmissionId          { get; set; }
}
