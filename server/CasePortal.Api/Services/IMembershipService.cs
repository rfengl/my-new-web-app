using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;

namespace CasePortal.Api.Services;

public interface IMembershipService
{
    Task<IEnumerable<Membership>> GetAllAsync();
    Task<Membership?>             GetByIdAsync(int id);
    Task<Membership>              CreateAsync(CreateMembershipRequest request);
    Task<Membership?>             UpdateAsync(int id, UpdateMembershipRequest request);
    Task<bool>                    DeleteAsync(int id);
    Task                          SetSubmissionIdAsync(int membershipId, int submissionId);
}
