using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;

namespace CasePortal.Api.Services;

public interface ISubmissionService
{
    SubmissionGL? GetById(string id);
    SubmissionGL? Create(CreateSubmissionRequest request);
    SubmissionGL? Update(string id, UpdateSubmissionRequest request);
    bool          Delete(string id);
}
