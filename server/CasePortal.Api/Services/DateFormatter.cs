namespace CasePortal.Api.Services;

public class DateFormatter : IDateFormatter
{
    private readonly string _format;

    public DateFormatter(IConfiguration config)
        => _format = config["Formatting:DateFormat"] ?? "yyyy-MM-dd";

    public string Format(DateOnly date)   => date.ToString(_format);
    public string Format(DateOnly? date)  => date?.ToString(_format) ?? "";
    public string Format(DateTime date)   => date.ToString(_format);
    public string Format(DateTime? date)  => date?.ToString(_format) ?? "";
}
