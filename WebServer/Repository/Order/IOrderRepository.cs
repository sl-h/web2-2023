using WebServer.Data;
using WebServer.DTOs;
using WebServer.Models;

namespace WebServer.Repository;

public interface IOrderRepository : IDbService<Order>
{
    Task AddItem(Order order, OrderItem item);

    Task RemoveItem(int id, Order order);

    Task UpdateStatus(int id, Status status);

    public List<OrderItem> GetOrderItems(int orderId);
}