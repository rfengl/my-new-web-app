namespace CasePortal.Api.Models;

public class Company
{
    public string Id          { get; set; } = "";
    public string Name        { get; set; } = "";
    public string Code        { get; set; } = "";
    public bool   IsActive    { get; set; } = true;
    public string CreatedDate { get; set; } = "";
}
