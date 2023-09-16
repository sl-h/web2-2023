using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebServer.Interfaces;

namespace WebServer.Models;


public enum Role
{
    //None = 0, vrati kasnije
    Admin,
    Salesman,
    Customer
}

public class User : IImageUploadable
{
    public int UserId { get; set; }

    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string FullName { get; set; }
    public Address Address { get; set; }
    public int AddressId { get; set; }
    public DateTime  Birthday { get; set; }
    public Role Role { get; set; }
    public bool Verified { get; set; }
    public string ImageName { get; set; } //name
    public string ImageSrc { get; set; } 
    public IFormFile ImageFile { get; set; }


    public string GetUniqueImageName()
    {
        return Username + '_' + FullName + Path.GetExtension(ImageName);
    }

}