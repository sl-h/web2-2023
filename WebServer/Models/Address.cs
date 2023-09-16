using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebServer.Models;

public class Address
{
    public int AddressId { get; set; }

    public string Street { get; set; } = null!;


    public int StreetNumber { get; set; }


    public string City { get; set; } = null!;


    public int PostCode { get; set; }

}