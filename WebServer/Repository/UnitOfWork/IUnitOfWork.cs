using WebServer.Repository;

namespace WebServer.Repository;

public interface IUnitOfWork : IDisposable
{
    IArticleRepository Articles { get; }
     IUsersRepository Users { get; }
     IOrderRepository Orders { get; }
    int SaveChanges();
}