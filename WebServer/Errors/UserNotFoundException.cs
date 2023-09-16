using WebServer.Models;

namespace WebServer.Errors;

public class UserNotFoundException : Exception
{
    public string UserEmail { get; }

    public UserNotFoundException(string email)
        : base($"User with email {email} and password was not found.\n Check credentials and try again.")
    {
        UserEmail = email;
    }
    
    public UserNotFoundException(int id)
        : base($"User with ID {id}  was not found.\n Check credentials and try again.")
    {
    }
}