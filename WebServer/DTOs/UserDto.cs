using Newtonsoft.Json;
using WebServer.Models;

namespace WebServer.DTOs;


public class UserDto
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string?Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public Address Address { get; set; }
    
    public DateTime Birthday { get; set; }
    public Role? Role { get; set; }
    public bool Verified { get; set; }

    public string? ImageName { get; set; }
    public string ImageSrc { get; set; }
    public IFormFile? ImageFile { get; set; }
    public string? token { get; set; }

}