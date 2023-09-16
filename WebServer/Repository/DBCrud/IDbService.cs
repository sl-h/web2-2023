using System.Linq.Expressions;

namespace WebServer.Repository;

public interface IDbService<T> where T : class
{
     Task<List<T>> GetAll();
     Task<T> GetById(int index);
     Task<T> Add(T item);
     Task AddRange(IEnumerable<T> items);
     Task<IEnumerable<T>> Find(Expression<Func<T, bool>> expression);
     Task<T> FindOne(Expression<Func<T, bool>> expression);
     Task Remove(int id); void RemoveRange(IEnumerable<T> items);
     void Remove(T item);
     void Update(T item);
}