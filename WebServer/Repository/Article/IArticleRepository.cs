using WebServer.Models;

namespace WebServer.Repository;

public interface IArticleRepository : IDbService<Article>
{
    //Task UpdateArticle(int id, Article article);
}