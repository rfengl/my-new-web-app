namespace CasePortal.Api.Models;

public class UserRole
{
    public byte     Id           { get; set; }
    public string   Code         { get; set; } = "";
    public string   Name         { get; set; } = "";
    public DateTime CreatedDate  { get; set; }
    public int      CreatedBy    { get; set; }
    public DateTime ModifiedDate { get; set; }
    public int      ModifiedBy   { get; set; }
}
