using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;

namespace CasePortal.Api.Services;

// In-memory store — replace with a database repository when ready
public class CaseService : ICaseService
{
    private readonly List<Case> _cases =
    [
        new() { Id = "C-001", Title = "Server outage in production",    Description = "Production servers went down at 3am. Needs immediate attention.", Status = "Open",        Priority = "High",   Date = "2026-06-01" },
        new() { Id = "C-002", Title = "Login timeout after 5 minutes",  Description = "Users are being logged out after 5 minutes of inactivity.",       Status = "In Progress", Priority = "Medium", Date = "2026-06-03" },
        new() { Id = "C-003", Title = "Export PDF feature not working",  Description = "PDF export button throws a 500 error on large datasets.",         Status = "Closed",      Priority = "Low",    Date = "2026-05-28" },
        new() { Id = "C-004", Title = "Dashboard chart renders empty",   Description = "The line chart on the main dashboard shows no data after refresh.",Status = "Open",        Priority = "Medium", Date = "2026-06-05" },
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

    public Case Create(CreateCaseRequest request)
    {
        lock (_lock)
        {
            _counter++;
            var next = new Case
            {
                Id          = $"C-{_counter:D3}",
                Title       = request.Title,
                Description = request.Description ?? string.Empty,
                Status      = request.Status,
                Priority    = request.Priority,
                Date        = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            };
            _cases.Add(next);
            return next;
        }
    }

    public Case? Update(string id, UpdateCaseRequest request)
    {
        lock (_lock)
        {
            var c = _cases.FirstOrDefault(x => x.Id == id);
            if (c is null) return null;

            if (request.Title       is not null) c.Title       = request.Title;
            if (request.Description is not null) c.Description = request.Description;
            if (request.Status      is not null) c.Status      = request.Status;
            if (request.Priority    is not null) c.Priority    = request.Priority;

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
