namespace WebServer.Interfaces;

public interface IImageUploadable
{
     string ImageName { get; set; } 
     string ImageSrc { get; set; } 
     IFormFile ImageFile { get; set; }
     string GetUniqueImageName();

}