namespace CasePortal.Api.Models;

public class Company
{
    public int      Id          { get; set; }
    public string   Name        { get; set; } = "";
    public string   Code        { get; set; } = "";
    public bool     IsActive    { get; set; } = true;
    public DateOnly CreatedDate { get; set; }
}
