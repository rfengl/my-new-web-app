using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;

namespace CasePortal.Api.Services;

public interface ISubmissionService
{
    Task<SubmissionGL?> GetByIdAsync(string id);
    Task<SubmissionGL?> CreateAsync(CreateSubmissionRequest request);
    Task<SubmissionGL?> UpdateAsync(string id, UpdateSubmissionRequest request);
    Task<bool>          DeleteAsync(string id);
}
