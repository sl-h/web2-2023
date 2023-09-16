// using WebServer.Models;
//
// namespace WebServer;
//
// public interface ISearchConditions<T> where T : class
// {
//     bool IsSatisfied(T entity);
// }
//
// public class FilterByRole : ISearchConditions<User>
// {
//     private readonly Role _role;
//     
//     public FilterByRole(Role role)
//     {
//         _role = role;
//     }
//     
//     public bool IsSatisfied(User entity)
//     {
//         return entity.Role.Equals(_role);
//     }
// }
//
//
// public class FilterByUserId : ISearchConditions<Order>
// {
//     private readonly int _userId;
//     
//     public FilterByUserId(int userId)
//     {
//         _userId = userId;
//     }
//     
//     public bool IsSatisfied(Order entity)
//     {
//         return entity.Customer.UserId.Equals(_userId);
//     }
// }


public class FilterByDate : ISearchConditions<Order>
{
    private readonly DateTime _date;
    
    public FilterByDate(DateTime date)
    {
        _date = date;
    }
    
    public bool IsSatisfied(Order entity)
    {
        return entity.OrderDate.Equals(_date);
    }
}


public class FilterByDateBefore : ISearchConditions<Order>
{
    private readonly DateTime _date;
    
    public FilterByDateBefore()
    {
        _date = DateTime.Now;
    }
    
    public bool IsSatisfied(Order entity)
    {
        return entity.OrderDate < _date;
    }
}


public class FilterByStatus : ISearchConditions<Order>
{
    private readonly Status _status;
    
    public FilterByStatus(Status status)
    {
        _status = status;
    }
    
    public bool IsSatisfied(Order entity)
    {
        return entity.Status.Equals(_status);
    }
}