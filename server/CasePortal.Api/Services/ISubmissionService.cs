using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;

namespace CasePortal.Api.Services;

public interface ISubmissionService
{
    Task<SubmissionGL?> GetByIdAsync(int id);
    Task<SubmissionGL?> CreateAsync(int membershipId, CreateSubmissionRequest request, int userId);
    Task<SubmissionGL?> UpdateAsync(int id, UpdateSubmissionRequest request, int userId);
    Task<bool>          DeleteAsync(int id);
}
