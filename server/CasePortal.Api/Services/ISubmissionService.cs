using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;

namespace CasePortal.Api.Services;

public interface ISubmissionService
{
    Task<SubmissionGL?> GetByIdAsync(int id);
    Task<SubmissionGL?> CreateAsync(int membershipId, CreateSubmissionRequest request);
    Task<SubmissionGL?> UpdateAsync(int id, UpdateSubmissionRequest request);
    Task<bool>          DeleteAsync(int id);
}
