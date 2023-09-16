using AutoMapper;
using WebServer.DTOs;
using WebServer.Errors;
using WebServer.Interfaces;
using WebServer.Models;
using WebServer.Repository;

namespace WebServer.Services;

public class ArticleService : IArticleService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly JwtService _jwtService;
    private readonly IMapper _dtoMapper;
    
    string relativePath = "Images/article images/";
    
    
    public ArticleService(IUnitOfWork unitOfWork,  JwtService jwtService, IMapper dtoMapper)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _dtoMapper = dtoMapper;
    }
    
    
    public async Task<List<ArticleDto>> GetAllArticles(HttpRequest Request)
    {
        var articles = await _unitOfWork.Articles.GetAll();
        foreach (var article in articles)
        {
            article.ImageSrc = GenerateImageSrc(article.ImageName, Request);
            Console.WriteLine(article.ImageSrc);
        }
        
        var articleDtos = articles.Select(a => _dtoMapper.Map<ArticleDto>(a));
        return articleDtos.ToList();
    }
    

    public async Task<ArticleDto> GetArticle(int id, HttpRequest Request)
    {
        var article = await _unitOfWork.Articles.GetById(id);
        
        if(article == null)
            throw new ItemNotFoundException(id);

        article.ImageSrc = GenerateImageSrc(article.ImageName, Request);
        
        return _dtoMapper.Map<ArticleDto>(article);
    }


    public async Task<List<ArticleDto>> GetByCategory(string category)
    {
        var articleCategory = (ArticleType)Enum.Parse(typeof(ArticleType), category);
        
        var articles = await _unitOfWork.Articles.Find(article => article.Type.Equals(articleCategory));
        var articlesDto = articles.Select(a=> _dtoMapper.Map<ArticleDto>(a));
        
        return articlesDto.ToList();
    }

    
    public async Task<int> CreateArticle(ArticleDto request, string email)
    {
        var user = await _unitOfWork.Users.FindOne(user => user.Email == email);
        if(user == null)
            throw new UserNotFoundException(email);
        
        var article = _dtoMapper.Map<Article>(request);
        
        article.SalesmanId = user.UserId;
        article.ImageName = await Common.SaveImageFile(article, relativePath);
        
        await _unitOfWork.Articles.Add(article);
        return _unitOfWork.SaveChanges();
    }


    public async Task<int> UpdateArticle(ArticleDto request)
    {
        var article = await _unitOfWork.Articles.FindOne(article => article.ArticleId == request.ArticleId);
        if (article == null)
            throw new Exception("Item not found");
        
        article.Description = request.Description;
        article.Name = request.Name;
        article.Price = request.Price;
        article.Type = request.Type;
        if (request.ImageFile != null)
        {
            article.ImageFile = request.ImageFile;
            article.ImageName = await Common.SaveImageFile(article,relativePath);
        }

        _unitOfWork.Articles.Update(article);
        return _unitOfWork.SaveChanges();
    }
    
    
    public async Task<int> DeleteArticle(int id)
    {
        var article = await _unitOfWork.Articles.GetById(id);
        if(article == null)
            throw new ItemNotFoundException(id);
        
        _unitOfWork.Articles.Remove(article);
        return _unitOfWork.SaveChanges();
    }


    public async Task<List<ArticleDto>> GetSalesmanArticles(string email, HttpRequest Request)
    {
        var user = await _unitOfWork.Users.FindOne(user => user.Email == email);
        if(user == null)
            throw new UserNotFoundException(email);
        
        
        var articles = await _unitOfWork.Articles.Find(article => article.SalesmanId == user.UserId);
        foreach (var article in articles)
        {
            article.ImageSrc = GenerateImageSrc(article.ImageName, Request);
            Console.WriteLine(article.ImageSrc);
        }
        
        
        var articlesDto = articles.Select(article => _dtoMapper.Map<ArticleDto>(article)).ToList();
        
        return articlesDto;
    }
    
    
    private string  GenerateImageSrc(string ImageName, HttpRequest Request)
    {
        return String.Format("{0}://{1}{2}/Images/article images/{3}", Request.Scheme, Request.Host, Request.PathBase, ImageName);
    }
}