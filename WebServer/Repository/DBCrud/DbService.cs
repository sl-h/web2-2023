using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using WebServer.Data;

namespace WebServer.Repository;

public class DbService<T> : IDbService<T> where T : class    //specify that T must be a reference type
{
    
    protected readonly DataContext _dbService;
    public DbService(DataContext dbContext)
    {
        _dbService = dbContext;
    }
    
    
    public async Task<List<T>> GetAll()
    {
        var items = await _dbService.Set<T>().ToListAsync();
        return items;
    }
    
    
    public async Task<T> GetById(int index)
    {
        var item = await _dbService.Set<T>().FindAsync(index);
        
        if(item != null)
            return item;
        else
            throw new Exception($"Entity with id {index} not found");
    }
    
    
    public async Task<T> Add(T item)
    { 
        await _dbService.Set<T>().AddAsync(item);
        return item;
    }
    
    
    public async Task AddRange(IEnumerable<T> items)
    {
        await _dbService.Set<T>().AddRangeAsync(items);
    }
    
    
    public async Task Remove(int index)
    {
        var item = await _dbService.Set<T>().FindAsync(index);
        
        if(item != null)
            _dbService.Set<T>().Remove(item);
        else
            throw new Exception("Entity not found");
    }
    
    
    public void Remove(T item)
    {
        _dbService.Set<T>().Remove(item);
    }
    
    
    public void RemoveRange(IEnumerable<T> items)
    {
        _dbService.Set<T>().RemoveRange(items);
    }
    
    
    public async Task<IEnumerable<T>> Find(Expression<Func<T, bool>> expression)
    {
        return await _dbService.Set<T>().Where(expression).ToListAsync();
    }
    
    
    public async Task<T> FindOne(Expression<Func<T, bool>> expression)
    {
        return await _dbService.Set<T>().Where(expression).FirstOrDefaultAsync();
    }
    
    public void  Update(T item)
    {
        _dbService.Set<T>().Update(item);
    }

}