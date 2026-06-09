namespace CasePortal.Api.Models;

public class User
{
    public string Id           { get; set; } = "";
    public string Email        { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string Name         { get; set; } = "";
    public string Role         { get; set; } = "User";
    public bool    IsActive     { get; set; } = true;
    public string  CreatedDate  { get; set; } = "";
    public string? CompanyId    { get; set; }
}
