using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net.Mime;
using WebServer.Interfaces;

namespace WebServer.Models;

public enum ArticleType
{

    AllSeason,
    Summer,
    Winter ,
}

public class Article : IImageUploadable
{
    
    public int ArticleId { get; set; }

    public ArticleType Type { get; set; }
    
    public string Name { get; set; }
    
    public float Price { get; set; }
    
    public User Salesman { get; set; }
    public int SalesmanId { get; set; }
    
    public string Description { get; set; }
    public string ImageName { get; set; } //name
     public string ImageSrc { get; set; } 
     public IFormFile ImageFile { get; set; }
     public string GetUniqueImageName()
     {
         return  Name + '_' + ArticleId + Path.GetExtension(ImageName);
     }
}