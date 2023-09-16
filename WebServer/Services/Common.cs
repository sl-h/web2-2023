using WebServer.Interfaces;

namespace WebServer.Services;

public static class Common
{
    private static string _basePath = @"C:\Users\rus\RiderProjects\Web2E\web\WebServer\";
    public static async Task<string> SaveImageFile(IImageUploadable obj, string relativePath)
    {
        try
        { 
            string folderName = Path.GetFileName(Path.GetDirectoryName(relativePath.TrimEnd('/')));
            
            
            if (obj.ImageFile == null)
            {
                return "default-img.jpeg";
            }

            string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }
            
            if (File.Exists(obj.ImageName))
            {
                File.Delete(obj.ImageName);
            }

            string uniqueFileName = obj.GetUniqueImageName();
            string filePath = Path.Combine(_basePath, relativePath, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await obj.ImageFile.CopyToAsync(stream);
            }

            return uniqueFileName;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }

    }
}