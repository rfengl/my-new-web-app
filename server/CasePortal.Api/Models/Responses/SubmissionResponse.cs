namespace CasePortal.Api.Models.Responses;

public record SubmissionResponse(
    string   Id,
    string   MembershipId,
    string   SubmissionStatus,
    string   RequestType,
    int      GlType,
    string   DisplayStatus,
    string   Mrn,
    string   BillingDate,
    string   DateOfAdmission,
    string   DateOfDischarge,
    string   DoctorName,
    string   DoctorSpecialty,
    string   ProvisionalDiagnosis,
    string   IcdCode,
    decimal  EstimatedCost,
    string   CreatedDate
);
