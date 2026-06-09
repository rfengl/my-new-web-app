using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;

namespace CasePortal.Api.Services;

public interface IMembershipService
{
    Task<IEnumerable<Membership>> GetAllAsync();
    Task<Membership?>             GetByIdAsync(string id);
    Task<Membership>              CreateAsync(CreateMembershipRequest request);
    Task<Membership?>             UpdateAsync(string id, UpdateMembershipRequest request);
    Task<bool>                    DeleteAsync(string id);
    Task                          SetSubmissionIdAsync(string membershipId, string submissionId);
}
