namespace CasePortal.Api.Models;

public class Company
{
    public int      Id          { get; set; }
    public string   Name        { get; set; } = "";
    public string   Code        { get; set; } = "";
    public bool     IsActive    { get; set; } = true;
    public DateTime CreatedDate { get; set; }
    public int      CreatedBy   { get; set; }
    public DateTime ModifiedDate { get; set; }
    public int      ModifiedBy   { get; set; }
}
