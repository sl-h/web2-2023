using WebServer.Models;

namespace WebServer.DTOs;

public class ArticleDto
{
    public ArticleType Type { get; set; }
    public int ArticleId { get; set; }
    
    public string Name { get; set; }
    
    public float Price { get; set; }
    public string Description { get; set; }
    
    public string? ImageName { get; set; }
    public string? ImageSrc { get; set; }
    public IFormFile? ImageFile { get; set; }
    public string Email { get; set; }


}