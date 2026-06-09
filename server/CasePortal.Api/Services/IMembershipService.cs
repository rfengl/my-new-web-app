using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;

namespace CasePortal.Api.Services;

public interface IMembershipService
{
    IEnumerable<Membership> GetAll();
    Membership?             GetById(string id);
    Membership              Create(CreateMembershipRequest request);
    Membership?             Update(string id, UpdateMembershipRequest request);
    bool                    Delete(string id);
    void                    SetSubmissionId(string membershipId, string submissionId);
}
