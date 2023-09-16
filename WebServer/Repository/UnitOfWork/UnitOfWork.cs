using AutoMapper;
using WebServer.Data;
using WebServer.Repository;

namespace WebServer.Repository;

public class UnitOfWork: IUnitOfWork
{
     private readonly DataContext _dataContext;
     public IArticleRepository Articles { get; private set; }  
     public IUsersRepository Users { get; private set; }  
     public IOrderRepository Orders { get; private set; }



     public UnitOfWork(DataContext dataContext)
    {
        _dataContext = dataContext;
        Articles = new ArticleRepository(_dataContext);
        Users = new UsersRepository(_dataContext);
        Orders = new OrderRepository(_dataContext);
    }  
    
    
    public void Dispose()
    {
        _dataContext.Dispose();
    }
    
    
    public int SaveChanges()
    {
        return _dataContext.SaveChanges();
    }
}
