using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;

namespace CasePortal.Api.Services;

public class MembershipService : IMembershipService
{
    private readonly List<Membership> _memberships =
    [
        new() { Id = "C-001", Name = "Ahmad bin Abdullah",    Nric = "801231-10-1234", PassportNo = "",           Insurance = "Takaful Malaysia", Company = "ABC Sdn Bhd",    PolicyNo = "TM-2024-00123",  RbEntitlement = 200, CoPayment = 10, CoInsurance = "N/A",  Deductible = 500,  PolicyEffDate = "2024-01-01", PolicyExpDate = "2025-01-01", PolicyLapseDate = "",           Status = "Inforce", UnderwritingExclusion = "",                        Date = "2026-06-01" },
        new() { Id = "C-002", Name = "Siti Rahayu bt Yusof", Nric = "900515-14-5678", PassportNo = "",           Insurance = "Prudential BSN",   Company = "XYZ Corp",       PolicyNo = "PRU-2023-00456", RbEntitlement = 300, CoPayment = 20, CoInsurance = "10%",  Deductible = 0,    PolicyEffDate = "2023-06-01", PolicyExpDate = "2024-06-01", PolicyLapseDate = "2024-05-15", Status = "Expired", UnderwritingExclusion = "Pre-existing hypertension", Date = "2026-06-03" },
        new() { Id = "C-003", Name = "Lim Wei Jie",          Nric = "",               PassportNo = "A12345678",  Insurance = "AIA",              Company = "DEF Bhd",        PolicyNo = "AIA-2024-00789", RbEntitlement = 250, CoPayment = 0,  CoInsurance = "20%",  Deductible = 1000, PolicyEffDate = "2024-03-15", PolicyExpDate = "2025-03-15", PolicyLapseDate = "",           Status = "Inforce", UnderwritingExclusion = "Knee surgery exclusion",    Date = "2026-05-28" },
        new() { Id = "C-004", Name = "Kavitha a/p Rajan",    Nric = "851120-07-2345", PassportNo = "",           Insurance = "Great Eastern",    Company = "GHI Industries", PolicyNo = "GE-2022-01011",  RbEntitlement = 150, CoPayment = 15, CoInsurance = "N/A",  Deductible = 750,  PolicyEffDate = "2022-11-20", PolicyExpDate = "2023-11-20", PolicyLapseDate = "2023-10-01", Status = "Expired", UnderwritingExclusion = "",                        Date = "2026-06-05" },
    ];

    private readonly Lock _lock    = new();
    private          int  _counter = 4;

    public IEnumerable<Membership> GetAll()
    {
        lock (_lock) return _memberships.OrderByDescending(m => m.Date).ToList();
    }

    public Membership? GetById(string id)
    {
        lock (_lock) return _memberships.FirstOrDefault(m => m.Id == id);
    }

    public Membership Create(CreateMembershipRequest req)
    {
        lock (_lock)
        {
            _counter++;
            var next = new Membership
            {
                Id                    = $"C-{_counter:D3}",
                Date                  = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                Name                  = req.Name,
                Nric                  = req.Nric,
                PassportNo            = req.PassportNo,
                Insurance             = req.Insurance,
                Company               = req.Company,
                PolicyNo              = req.PolicyNo,
                RbEntitlement         = req.RbEntitlement,
                CoPayment             = req.CoPayment,
                CoInsurance           = req.CoInsurance,
                Deductible            = req.Deductible,
                PolicyEffDate         = req.PolicyEffDate,
                PolicyExpDate         = req.PolicyExpDate,
                PolicyLapseDate       = req.PolicyLapseDate,
                Status                = req.Status,
                UnderwritingExclusion = req.UnderwritingExclusion,
            };
            _memberships.Add(next);
            return next;
        }
    }

    public Membership? Update(string id, UpdateMembershipRequest req)
    {
        lock (_lock)
        {
            var m = _memberships.FirstOrDefault(x => x.Id == id);
            if (m is null) return null;

            if (req.Name                  is not null) m.Name                  = req.Name;
            if (req.Nric                  is not null) m.Nric                  = req.Nric;
            if (req.PassportNo            is not null) m.PassportNo            = req.PassportNo;
            if (req.Insurance             is not null) m.Insurance             = req.Insurance;
            if (req.Company               is not null) m.Company               = req.Company;
            if (req.PolicyNo              is not null) m.PolicyNo              = req.PolicyNo;
            if (req.RbEntitlement         is not null) m.RbEntitlement         = req.RbEntitlement.Value;
            if (req.CoPayment             is not null) m.CoPayment             = req.CoPayment.Value;
            if (req.CoInsurance           is not null) m.CoInsurance           = req.CoInsurance;
            if (req.Deductible            is not null) m.Deductible            = req.Deductible.Value;
            if (req.PolicyEffDate         is not null) m.PolicyEffDate         = req.PolicyEffDate;
            if (req.PolicyExpDate         is not null) m.PolicyExpDate         = req.PolicyExpDate;
            if (req.PolicyLapseDate       is not null) m.PolicyLapseDate       = req.PolicyLapseDate;
            if (req.Status                is not null) m.Status                = req.Status;
            if (req.UnderwritingExclusion is not null) m.UnderwritingExclusion = req.UnderwritingExclusion;

            return m;
        }
    }

    public bool Delete(string id)
    {
        lock (_lock)
        {
            var m = _memberships.FirstOrDefault(x => x.Id == id);
            if (m is null) return false;
            _memberships.Remove(m);
            return true;
        }
    }

    public void SetSubmissionId(string membershipId, string submissionId)
    {
        lock (_lock)
        {
            var m = _memberships.FirstOrDefault(x => x.Id == membershipId);
            if (m is not null) m.SubmissionId = submissionId;
        }
    }
}
