using WebServer.Models;

namespace WebServer.Errors;

public class UserAlreadyExistsException : Exception
{
    public string UserEmail { get; }

    public UserAlreadyExistsException(string email)
        : base($"User with email {email} already exists.\n Try another one.")
    {
        UserEmail = email;
    }
}