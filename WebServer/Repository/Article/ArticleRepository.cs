using Microsoft.EntityFrameworkCore;
using WebServer.Data;
using WebServer.Models;

namespace WebServer.Repository;

public class ArticleRepository : DbService<Article> ,IArticleRepository
{
  public ArticleRepository(DataContext dbContext) : base(dbContext){ }
}