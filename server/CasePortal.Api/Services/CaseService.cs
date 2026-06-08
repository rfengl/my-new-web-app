using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;

namespace CasePortal.Api.Services;

// In-memory store — replace with a database repository when ready
public class CaseService : ICaseService
{
    private readonly List<Case> _cases =
    [
        new() { Id = "C-001", Name = "Ahmad bin Abdullah",    Nric = "801231-10-1234", PassportNo = "",           Insurance = "Takaful Malaysia", Company = "ABC Sdn Bhd",    PolicyNo = "TM-2024-00123", RbEntitlement = 200, CoPayment = 10, CoInsurance = "N/A",  Deductible = 500,   PolicyEffDate = "2024-01-01", PolicyExpDate = "2025-01-01", PolicyLapseDate = "",           Status = "Inforce", UnderwritingExclusion = "",                        Date = "2026-06-01" },
        new() { Id = "C-002", Name = "Siti Rahayu bt Yusof", Nric = "900515-14-5678", PassportNo = "",           Insurance = "Prudential BSN",   Company = "XYZ Corp",       PolicyNo = "PRU-2023-00456", RbEntitlement = 300, CoPayment = 20, CoInsurance = "10%",  Deductible = 0,     PolicyEffDate = "2023-06-01", PolicyExpDate = "2024-06-01", PolicyLapseDate = "2024-05-15", Status = "Expired", UnderwritingExclusion = "Pre-existing hypertension", Date = "2026-06-03" },
        new() { Id = "C-003", Name = "Lim Wei Jie",          Nric = "",               PassportNo = "A12345678",  Insurance = "AIA",              Company = "DEF Bhd",        PolicyNo = "AIA-2024-00789", RbEntitlement = 250, CoPayment = 0,  CoInsurance = "20%",  Deductible = 1000,  PolicyEffDate = "2024-03-15", PolicyExpDate = "2025-03-15", PolicyLapseDate = "",           Status = "Inforce", UnderwritingExclusion = "Knee surgery exclusion",    Date = "2026-05-28" },
        new() { Id = "C-004", Name = "Kavitha a/p Rajan",    Nric = "851120-07-2345", PassportNo = "",           Insurance = "Great Eastern",    Company = "GHI Industries", PolicyNo = "GE-2022-01011",  RbEntitlement = 150, CoPayment = 15, CoInsurance = "N/A",  Deductible = 750,   PolicyEffDate = "2022-11-20", PolicyExpDate = "2023-11-20", PolicyLapseDate = "2023-10-01", Status = "Expired", UnderwritingExclusion = "",                        Date = "2026-06-05" },
    ];

    private readonly Lock _lock    = new();
    private          int  _counter = 4;

    public IEnumerable<Case> GetAll()
    {
        lock (_lock) return _cases.OrderByDescending(c => c.Date).ToList();
    }

    public Case? GetById(string id)
    {
        lock (_lock) return _cases.FirstOrDefault(c => c.Id == id);
    }

    public Case Create(CreateCaseRequest req)
    {
        lock (_lock)
        {
            _counter++;
            var next = new Case
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
            _cases.Add(next);
            return next;
        }
    }

    public Case? Update(string id, UpdateCaseRequest req)
    {
        lock (_lock)
        {
            var c = _cases.FirstOrDefault(x => x.Id == id);
            if (c is null) return null;

            if (req.Name                  is not null) c.Name                  = req.Name;
            if (req.Nric                  is not null) c.Nric                  = req.Nric;
            if (req.PassportNo            is not null) c.PassportNo            = req.PassportNo;
            if (req.Insurance             is not null) c.Insurance             = req.Insurance;
            if (req.Company               is not null) c.Company               = req.Company;
            if (req.PolicyNo              is not null) c.PolicyNo              = req.PolicyNo;
            if (req.RbEntitlement         is not null) c.RbEntitlement         = req.RbEntitlement.Value;
            if (req.CoPayment             is not null) c.CoPayment             = req.CoPayment.Value;
            if (req.CoInsurance           is not null) c.CoInsurance           = req.CoInsurance;
            if (req.Deductible            is not null) c.Deductible            = req.Deductible.Value;
            if (req.PolicyEffDate         is not null) c.PolicyEffDate         = req.PolicyEffDate;
            if (req.PolicyExpDate         is not null) c.PolicyExpDate         = req.PolicyExpDate;
            if (req.PolicyLapseDate       is not null) c.PolicyLapseDate       = req.PolicyLapseDate;
            if (req.Status                is not null) c.Status                = req.Status;
            if (req.UnderwritingExclusion is not null) c.UnderwritingExclusion = req.UnderwritingExclusion;

            return c;
        }
    }

    public bool Delete(string id)
    {
        lock (_lock)
        {
            var c = _cases.FirstOrDefault(x => x.Id == id);
            if (c is null) return false;
            _cases.Remove(c);
            return true;
        }
    }
}
