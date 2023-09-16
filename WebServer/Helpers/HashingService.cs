using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Org.BouncyCastle.Crypto.Generators;

namespace WebServer.Repository;

public static class HashingService
{
    private static string saltNum = "e547689842r43=ff3";
    public static string GetHash(string password)
    {   
        
        byte[] salt = Encoding.ASCII.GetBytes(saltNum); // divide by 8 to convert bits to bytes
        //Console.WriteLine($"Salt: {Convert.ToBase64String(salt)}");

        // derive a 256-bit subkey (use HMACSHA256 with 100,000 iterations)
        string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password!,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 100000,
            numBytesRequested: 256 / 8));

        return hashed;
    }   
}