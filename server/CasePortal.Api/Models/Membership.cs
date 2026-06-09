namespace CasePortal.Api.Models;

public class Membership
{
    public int       Id                    { get; set; }
    public DateTime  CreatedDate           { get; set; }
    public int       CreatedBy             { get; set; }
    public DateTime  ModifiedDate          { get; set; }
    public int       ModifiedBy            { get; set; }
    public string    Name                  { get; set; } = string.Empty;
    public string    IdType                { get; set; } = "NRIC";
    public string    IdNo                  { get; set; } = string.Empty;
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
