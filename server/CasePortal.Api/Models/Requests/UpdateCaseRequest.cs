using System.ComponentModel.DataAnnotations;

namespace CasePortal.Api.Models.Requests;

public class UpdateCaseRequest
{
    [MaxLength(200)]
    public string?  Name                  { get; set; }
    public string?  Nric                  { get; set; }
    public string?  PassportNo            { get; set; }
    public string?  Insurance             { get; set; }
    public string?  Company               { get; set; }
    public string?  PolicyNo              { get; set; }
    public decimal? RbEntitlement         { get; set; }
    public decimal? CoPayment             { get; set; }
    public string?  CoInsurance           { get; set; }
    public decimal? Deductible            { get; set; }
    public string?  PolicyEffDate         { get; set; }
    public string?  PolicyExpDate         { get; set; }
    public string?  PolicyLapseDate       { get; set; }
    public string?  Status                { get; set; }
    public string?  UnderwritingExclusion { get; set; }
}
