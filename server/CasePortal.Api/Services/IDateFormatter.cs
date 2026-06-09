namespace CasePortal.Api.Services;

public interface IDateFormatter
{
    string Format(DateOnly date);
    string Format(DateOnly? date);
}
