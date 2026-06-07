namespace CasePortal.Api.Models;

public class Case
{
    public string Id          { get; set; } = string.Empty;
    public string Title       { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status      { get; set; } = "Open";
    public string Priority    { get; set; } = "Medium";
    public string Date        { get; set; } = string.Empty;
}
