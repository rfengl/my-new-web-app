using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;

namespace CasePortal.Api.Services;

public class SubmissionService(IMembershipService memberships) : ISubmissionService
{
    private readonly List<SubmissionGL> _submissions = [];
    private readonly Lock _lock    = new();
    private          int  _counter = 0;

    public SubmissionGL? GetById(string id)
    {
        lock (_lock) return _submissions.FirstOrDefault(s => s.Id == id);
    }

    public SubmissionGL? Create(CreateSubmissionRequest req)
    {
        if (memberships.GetById(req.MembershipId) is null) return null;

        lock (_lock)
        {
            _counter++;
            var next = new SubmissionGL
            {
                Id               = $"GL-{_counter:D3}",
                MembershipId     = req.MembershipId,
                SubmissionStatus = req.SubmissionStatus,
                RequestType      = req.RequestType,
                GlType           = req.GlType,
                Mrn              = req.Mrn,
                CreatedDate      = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            };
            _submissions.Add(next);
            memberships.SetSubmissionId(req.MembershipId, next.Id);
            return next;
        }
    }

    public SubmissionGL? Update(string id, UpdateSubmissionRequest req)
    {
        lock (_lock)
        {
            var s = _submissions.FirstOrDefault(x => x.Id == id);
            if (s is null) return null;

            if (req.SubmissionStatus is not null) s.SubmissionStatus = req.SubmissionStatus;
            if (req.RequestType      is not null) s.RequestType      = req.RequestType;
            if (req.GlType           is not null) s.GlType           = req.GlType.Value;
            if (req.Mrn              is not null) s.Mrn              = req.Mrn;

            return s;
        }
    }

    public bool Delete(string id)
    {
        lock (_lock)
        {
            var s = _submissions.FirstOrDefault(x => x.Id == id);
            if (s is null) return false;
            _submissions.Remove(s);
            return true;
        }
    }
}
