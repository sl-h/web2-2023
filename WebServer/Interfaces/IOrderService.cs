using WebServer.DTOs;
using WebServer.Models;
using WebServer.Repository;

namespace WebServer.Interfaces;

public interface IOrderService
{
    public Task<int> CreateOrder(OrderDto request);
    public Task UpdateStatus(int id, Status status);
    public Task<List<OrderDto>>GetAllOrders(int userId);
    public Task<List<OrderDto>>GetOrders();
    public Task<List<OrderDto>> GetOrdersByStatus(int id, string status);
    public Task<int> DeleteOrder(int id);
    
}