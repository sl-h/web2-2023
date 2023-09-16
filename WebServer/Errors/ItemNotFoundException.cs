using WebServer.Models;

namespace WebServer.Errors;

public class ItemNotFoundException : Exception
{
    public ItemNotFoundException(int id)
        : base($"Item with id {id} was not found") { }
}