using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using WebServer.Repository;

namespace WebServer.Middleware;

public class AuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly JwtService _jwtService;
    private readonly IConfiguration _configuration;

  
    public AuthMiddleware(RequestDelegate next, JwtService jwtService, IConfiguration configuration)
    {
        _next = next;
        _jwtService = jwtService;
        _configuration = configuration;
    }
    

  public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            if(context.Request.Path.Equals("/api/User/logIn", StringComparison.OrdinalIgnoreCase) || 
               context.Request.Path.Equals("/api/User/register", StringComparison.OrdinalIgnoreCase) || 
               context.Request.Path.Equals("/api/User/logIn-google", StringComparison.OrdinalIgnoreCase) )
                await _next(context);
            else
            {
                string authorizationHeader = context.Request.Headers["Authorization"];

                if (!string.IsNullOrEmpty(authorizationHeader) && authorizationHeader.StartsWith("Bearer "))
                {
                    string tokenWithQuotes = authorizationHeader.Substring(7);
                    string token = tokenWithQuotes.Trim('"'); // Remove surrounding double quotes
                    Console.WriteLine("Received token: " + token);

                    // Verify the token using the JwtService
                    JwtSecurityToken jwtToken = _jwtService.Verify(token);

                    // You can now access the claims from the validated token
                    // Example: string username = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

                    await _next(context);
                }
                else
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                }
            }
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine("Error in auth middleware: " + ex.Message);
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        }
    }

}