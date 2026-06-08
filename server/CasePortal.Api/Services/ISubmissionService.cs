using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;

namespace CasePortal.Api.Services;

public interface ISubmissionService
{
    IEnumerable<SubmissionGL> GetAll(string membershipId);
    SubmissionGL?             GetById(string membershipId, string id);
    SubmissionGL?             Create(string membershipId, CreateSubmissionRequest request);
    SubmissionGL?             Update(string membershipId, string id, UpdateSubmissionRequest request);
    bool                      Delete(string membershipId, string id);
}
