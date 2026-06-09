using System.Security.Cryptography;

namespace CasePortal.Api.Services;

// Deterministic AES-ECB encryption of integer PKs so raw IDs are never exposed over the wire.
// Key must be exactly 32 bytes, base64-encoded, stored in IdEncryption:Key.
public class IdEncryptionService : IIdEncryptionService
{
    private readonly byte[] _key;

    public IdEncryptionService(IConfiguration config)
    {
        var b64 = config["IdEncryption:Key"]
            ?? throw new InvalidOperationException("IdEncryption:Key is not configured.");
        _key = Convert.FromBase64String(b64);
        if (_key.Length != 32)
            throw new InvalidOperationException("IdEncryption:Key must decode to exactly 32 bytes.");
    }

    public string Encrypt(int id)
    {
        using var aes  = Aes.Create();
        aes.Key        = _key;
        aes.Mode       = CipherMode.ECB;
        aes.Padding    = PaddingMode.PKCS7;
        using var enc  = aes.CreateEncryptor();
        var plain      = BitConverter.GetBytes(id);
        var cipher     = enc.TransformFinalBlock(plain, 0, plain.Length);
        return Convert.ToBase64String(cipher)
            .Replace('+', '-').Replace('/', '_').TrimEnd('=');
    }

    public int Decrypt(string token)
    {
        var padded = token.Replace('-', '+').Replace('_', '/')
            + new string('=', (4 - token.Length % 4) % 4);
        var cipher     = Convert.FromBase64String(padded);
        using var aes  = Aes.Create();
        aes.Key        = _key;
        aes.Mode       = CipherMode.ECB;
        aes.Padding    = PaddingMode.PKCS7;
        using var dec  = aes.CreateDecryptor();
        var plain      = dec.TransformFinalBlock(cipher, 0, cipher.Length);
        return BitConverter.ToInt32(plain, 0);
    }
}
