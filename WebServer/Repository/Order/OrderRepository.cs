using System.Data;
using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using WebServer.Data;
using WebServer.DTOs;
using WebServer.Models;

namespace WebServer.Repository;

public class OrderRepository : DbService<Order>, IOrderRepository
{
    public OrderRepository(DataContext dataContext) : base(dataContext) {}

    public List<OrderItem> GetOrderItems(int orderId)
    {
        var items = _dbService.OrderItems.Where(item => item.OrderId == orderId).ToList();
        return items;
    }


    public async Task AddItem(Order order, OrderItem item) //add item to order
    {
        order.OrderItems = GetOrderItems(order.Id);

        foreach (OrderItem oi in order.OrderItems)
        {
            if (oi.ArticleId == item.ArticleId)
            {
                oi.Quantity = item.Quantity;
                order.TotalAmount += oi.ArticlePrice;
            }
        }
        
        
        order.OrderItems.Add(item);
        order.TotalAmount += item.ArticlePrice;
        Update(order);
    }
    
    
    
    public async Task RemoveItem(int articleId, Order order) //remove item from order
    {
        order.OrderItems = GetOrderItems(order.Id);

        var itemsCopy = new List<OrderItem>(order.OrderItems);

        //can't directly delete from collection, while iterating through it
        foreach (var oi in itemsCopy)
        {
            if (oi.ArticleId == articleId)
            {
                order.TotalAmount -= oi.ArticlePrice;
                order.OrderItems.Remove(oi);
                _dbService.OrderItems.Remove(oi);
            }
        }

        if (order.OrderItems.IsNullOrEmpty())
            Remove(order); 
        //preusmeri na home
        else
            Update(order);
    }
    
    
    
    public async Task UpdateStatus(int id, Status status)
    {
        //check if user exists
        var order = await GetById(id);
        
        if (order == null)
            throw new Exception("Order not found");
        
        //update properties
        order.Status = status;

        //update database
        Update(order);
    }
    
   
}