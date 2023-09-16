using WebServer.DTOs;
using WebServer.Models;
using WebServer.Repository;

namespace WebServer.Repository;

public interface IUsersRepository : IDbService<User> 
{
    public Task<List<User>> GetUsers();
    public  Task<List<User>> GetUsers(bool verified);
    public  Task<User> GetUserById(int id);
    public Address GetUserAddress(int addressId);

}