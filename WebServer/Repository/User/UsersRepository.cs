using WebServer.Data;
using WebServer.Models;


namespace WebServer.Repository;

public class UsersRepository : DbService<User>, IUsersRepository
{
    public UsersRepository(DataContext dbContext) : base(dbContext) {}
    
    
    public async Task<List<User>> GetUsers()
    {
        var users = await GetAll();
        foreach (var user in users)
        {
            user.Address = GetUserAddress(user.AddressId);  
        }
        
        return users.ToList();
    }
    
    
    public async Task<List<User>> GetUsers(bool verified)
    {
        var users = await Find(user => user.Verified == verified);
        foreach (var user in users)
        {
            user.Address = GetUserAddress(user.AddressId);  
        }
        
        
        return users.ToList();
    }

    
    public Address GetUserAddress(int addressId)
    {
       var address =  _dbService.Addresses.SingleOrDefault(addr => addr.AddressId == addressId);
       return address;
    }


    public async Task<User> GetUserById(int id)
    {
        var user = await GetById(id);
        user.Address = GetUserAddress(user.AddressId);
        
        return user;
    }
    

    
  

}

