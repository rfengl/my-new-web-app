namespace CasePortal.Api.Models;

public class SubmissionGL
{
    private static readonly Dictionary<string, string> _hospitalMap = new()
    {
        { "New GL",          "Draft"          },
        { "New Top Up",      "New Top Up"     },
        { "Processing",      "Processing"     },
        { "Defer Out",       "Defer Out"      },
        { "Defer Reply",     "Submitted"      },
        { "Add Doc",         "Processing"     },
        { "Notif. Approved", "Submitted"      },
        { "IGL Approved",    "Approved"       },
        { "FGL Approved",    "Approved"       },
        { "Declined",        "Declined"       },
        { "Cancelled",       "Cancelled"      },
        { "Medical review",  "Medical review" },
    };

    public int      Id                   { get; set; }
    public int      MembershipId         { get; set; }
    public string   SubmissionStatus     { get; set; } = string.Empty;
    public string   RequestType          { get; set; } = string.Empty;
    public int      GlType               { get; set; }
    public string   Mrn                  { get; set; } = string.Empty;
    public string   BillingDate          { get; set; } = string.Empty;
    public string   DateOfAdmission      { get; set; } = string.Empty;
    public string   DateOfDischarge      { get; set; } = string.Empty;
    public string   DoctorName           { get; set; } = string.Empty;
    public string   DoctorSpecialty      { get; set; } = string.Empty;
    public string   ProvisionalDiagnosis { get; set; } = string.Empty;
    public string   IcdCode              { get; set; } = string.Empty;
    public decimal  EstimatedCost        { get; set; }
    public string   CreatedDate          { get; set; } = string.Empty;

    // 1 = Client, 2 = Hospital
    public string DisplayStatus => GlType == 2
        ? _hospitalMap.GetValueOrDefault(SubmissionStatus, SubmissionStatus)
        : SubmissionStatus;
}
