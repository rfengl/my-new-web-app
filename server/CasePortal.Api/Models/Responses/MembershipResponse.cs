namespace CasePortal.Api.Models.Responses;

public record MembershipResponse(
    string   Id,
    string   CreatedDate,
    string   Name,
    string   IdType,
    string   IdNo,
    string   Insurance,
    string   Company,
    string   PolicyNo,
    decimal  RbEntitlement,
    decimal  CoPayment,
    string   CoInsurance,
    decimal  Deductible,
    string   PolicyEffDate,
    string   PolicyExpDate,
    string   PolicyLapseDate,
    string   Status,
    string   UnderwritingExclusion,
    string?  SubmissionId
);
