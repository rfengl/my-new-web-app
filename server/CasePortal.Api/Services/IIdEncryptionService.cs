namespace CasePortal.Api.Services;

public interface IIdEncryptionService
{
    string Encrypt(int id);
    int    Decrypt(string token);
}
