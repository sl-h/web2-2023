using AutoMapper;
using Org.BouncyCastle.Tls.Crypto;
using WebServer.DTOs;
using WebServer.Models;

namespace WebServer;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<User, UserDto>();
                  /*.ForMember(des => des.ImageSrc,
            opt => opt.MapFrom(src => ConvertToFormFile(src.ImageSrc)));*/

        CreateMap<UserDto, User>().ForMember(des => des.Verified,
            opt => opt.MapFrom(src => src.Role != Role.Salesman));




        CreateMap<Article, ArticleDto>();
        
        CreateMap<Order, OrderDto>();
        CreateMap<OrderItem, OrderItemDto>();

        CreateMap<ArticleDto, Article>();
        CreateMap<OrderItemDto, OrderItem>();
        
        CreateMap<OrderDto, Order>()
            .ForMember(des =>des.CustomerId,
                opt => opt.MapFrom(src => src.CustomerId))
            .ForMember(des=>des.OrderItems,
                opt => opt.MapFrom(src => src.OrderItems))
            .ForMember(
                des => des.OrderDate,
                opt => opt.MapFrom(src => DateTime.Now))
            .ForMember(
                des => des.Status,
                opt => opt.MapFrom(src => Status.Pending));

      

    }
    
    /*static IFormFile ConvertToFormFile(string filePath)
    {
        try
        {
            FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            string fileName = Path.GetFileName(filePath);
            IFormFile formFile = new FormFile(fileStream, 0, fileStream.Length, null, fileName);
            return formFile;
        }
        catch (Exception ex)
        {
            Console.WriteLine("An error occurred while converting to IFormFile: " + ex.Message);
            return null;
        }
    }*/
    

}