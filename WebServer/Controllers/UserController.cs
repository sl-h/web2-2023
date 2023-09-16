using System.Web.Http.Cors;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServer.DTOs;
using WebServer.Interfaces;
using WebServer.Models;



namespace WebServer.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors(origins: "*", headers: "*", methods: "*")]
public class UserController : Controller
{
    private readonly IUserService _userService;
    public UserController(IConfiguration configuration, IUserService userService)
    {
        _userService = userService;
    }
  
    
    [HttpGet("get-users")] 
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDto>> GetUsers()
    {
        var users = await _userService.GetAllUsers();
        foreach (var user in users)
        {
            user.ImageSrc =  String.Format("{0}://{1}{2}/Images/user images/{3}", Request.Scheme, Request.Host, Request.PathBase, user.ImageName);
        }
     
        return users.Count == 0 ? Ok("There are no users") : Ok(users);
    }
    
    
    [HttpGet("get-unverified-users")] 
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDto>> GetUnverifiedUsers()
    {
        var verified = false;
        var users = await _userService.GetUsers(verified);
        
        return users.Count == 0 ? Ok() : Ok(users);
    } 
    
    
    [HttpGet("get-verified-users")] 
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDto>> GetVerifiedUsers()
    {
        var verified = true;
        var users = await _userService.GetUsers(verified);
        
        return users.Count == 0 ? Ok() : Ok(users);
    } 
    
    
    [HttpGet ("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _userService.GetUserById(id);


        if (user == null)
            return Ok("User not found");
        
        return Ok(user);
    }
    

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> RegisterUser([FromForm]UserDto request)
    {
        try
        {
            var user = await _userService.Register(request);

            if (user == null)
                return BadRequest("User already exists");

            return Ok("User successfully registered");
        }
        catch (Exception ex)
        {
            // Log the exception or display a meaningful error message
            Console.WriteLine("An error occurred during user registration: " + ex.Message);
            return StatusCode(500, "Internal Server Error");
        }
    }
    
    
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<List<UserDto>>> LogIn(LoginDto request)
    {
        var user = await _userService.Login(request, Request);
        if(user == null)
            return BadRequest("Invalid credentials");
        
        return Ok(user);
    }
    
    
    [AllowAnonymous]
    [HttpPost("logIn-google")]
    public async Task<IActionResult> GoogleLogin([FromBody] string googleAccessToken = null)
    {
        if (!string.IsNullOrEmpty(googleAccessToken))
        {
            UserDto response = await _userService.GoogleLogin(googleAccessToken, Request);
            if (response != null)
            {
                return Ok(response);
            }
            else
            {
                return Problem("Error logging in with Google");
            }
        }
        return BadRequest();
            
    }
    
    
    [HttpDelete ("{id}")]
    [Authorize(Roles = "Admin,Salesman,Customer")] // Every user can delete his account
    public async Task<ActionResult<User>> DeleteUser(int id)
    {
        var changes = await _userService.DeleteUser(id);
        
        if(changes > 0)
            return Ok("User successfully deleted"); 
        
        return BadRequest("Error deleting user");
    }
    
    
    [HttpPut( "update-user")]
    [Authorize (Roles = "Admin,Salesman,Customer")]
    public async Task<ActionResult<UserDto>> UpdateUser( [FromForm]UserDto request)
    {
        var user = await _userService.EditUserProfile(request, Request);
        return Ok(user);
    }
    
    
    [HttpPut( "verify-user{email}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDto>>VerifyUser(string email)
    {
        var changes = await _userService.VerifyUser(email);
        if(changes > 0)
            return Ok("User successfully verified");
      
        return BadRequest("User not found");
    }
}

