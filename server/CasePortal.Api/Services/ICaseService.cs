using CasePortal.Api.Models;
using CasePortal.Api.Models.Requests;

namespace CasePortal.Api.Services;

public interface ICaseService
{
    IEnumerable<Case> GetAll();
    Case?             GetById(string id);
    Case              Create(CreateCaseRequest request);
    Case?             Update(string id, UpdateCaseRequest request);
    bool              Delete(string id);
}
