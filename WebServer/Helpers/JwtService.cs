using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using WebServer.Models;

namespace WebServer.Repository;

public class JwtService 
{
    private readonly IConfiguration _configuration;
    
    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public string CreateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("JwtSettings:SecretKey").Value!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
         
        List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.NameIdentifier, user.Username),
            new Claim(ClaimTypes.GivenName, user.FullName),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };
         
        var token = new JwtSecurityToken(
            issuer: _configuration.GetSection("JwtSettings:Issuer").Value,
            audience: _configuration.GetSection("JwtSettings:Audience").Value,
            claims: claims,
            expires: DateTime.Now.AddMinutes(Double.Parse(_configuration.GetSection("JwtSettings:AccessExpiration").Value)), //prebaci u config
            signingCredentials: creds
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return jwt;
    }

    public JwtSecurityToken Verify(string jwt)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration.GetSection("JwtSettings:SecretKey").Value!);
        
        tokenHandler.ValidateToken(jwt, new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = _configuration.GetSection("JwtSettings:Issuer").Value,
            ValidAudience = _configuration.GetSection("JwtSettings:Audience").Value,
            ValidateLifetime = true
        }, out SecurityToken validatedToken);

        return  (JwtSecurityToken)validatedToken;
    }
}