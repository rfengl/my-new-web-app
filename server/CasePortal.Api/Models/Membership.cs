namespace CasePortal.Api.Models;

public class Membership
{
    public int      Id                    { get; set; }
    public string   Date                  { get; set; } = string.Empty;
    public string   Name                  { get; set; } = string.Empty;
    public string   Nric                  { get; set; } = string.Empty;
    public string   PassportNo            { get; set; } = string.Empty;
    public string   Insurance             { get; set; } = string.Empty;
    public string   Company               { get; set; } = string.Empty;
    public string   PolicyNo              { get; set; } = string.Empty;
    public decimal  RbEntitlement         { get; set; }
    public decimal  CoPayment             { get; set; }
    public string   CoInsurance           { get; set; } = string.Empty;
    public decimal  Deductible            { get; set; }
    public string   PolicyEffDate         { get; set; } = string.Empty;
    public string   PolicyExpDate         { get; set; } = string.Empty;
    public string   PolicyLapseDate       { get; set; } = string.Empty;
    public string   Status                { get; set; } = "Inforce";
    public string   UnderwritingExclusion { get; set; } = string.Empty;
    public int?     SubmissionId          { get; set; }
}
