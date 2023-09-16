using WebServer.DTOs;
using WebServer.Models;

namespace WebServer.Interfaces;

public interface IUserService
{
    public Task<UserDto> Login(LoginDto request, HttpRequest httpRequest);
    
    public Task<UserDto> GoogleLogin(string accessToken, HttpRequest httpRequest);
    
    public Task<UserDto> Register(UserDto request);
    
    public Task<UserDto> EditUserProfile(UserDto request, HttpRequest httpRequest);
    
    public Task<int> VerifyUser(string email);
    
    public Task<int> DeleteUser(int id);
    
    public Task<List<UserDto>> GetAllUsers();
    
    public Task<List<UserDto>> GetUsers(bool verified);
    
    public Task<UserDto> GetUserById(int id);


}
                