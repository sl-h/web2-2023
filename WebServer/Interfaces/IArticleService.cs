using WebServer.DTOs;
using WebServer.Models;

namespace WebServer.Interfaces;

public interface IArticleService
{
    public Task<List<ArticleDto>> GetAllArticles(HttpRequest Request);
    public Task<ArticleDto> GetArticle(int id, HttpRequest Request);
    public Task<List<ArticleDto>>GetByCategory(string category);
    public Task<int> CreateArticle(ArticleDto request, string email);
    public Task<List<ArticleDto>> GetSalesmanArticles(string email, HttpRequest Request);
    
    public Task<int> UpdateArticle(ArticleDto request);
    public  Task<int> DeleteArticle(int id);
    
}

