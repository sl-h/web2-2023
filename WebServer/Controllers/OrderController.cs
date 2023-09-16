using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using System.Web.Http.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebServer.DTOs;
using WebServer.Interfaces;
using WebServer.Models;
using WebServer.Repository;

namespace WebServer.Controllers;

[Route("api/[controller]")]
[EnableCors(origins: "*", headers: "*", methods: "*")]
public class OrderController : Controller
{
    private readonly IOrderService _orderService;
    
    public OrderController(IConfiguration configuration, IOrderService orderService)
    {
        _orderService = orderService;
    }
    

    [HttpPost("create-order")]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult> Order([FromBody]OrderDto request)
    {
        if (request.OrderItems.IsNullOrEmpty())
            return BadRequest(); 
        
       int result = await _orderService.CreateOrder(request);
       
       if(result == 0)
              return BadRequest("Order not created");
       
        
        return Ok("Order created");
    }
    

    [HttpDelete("delete-order/{id}")]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult> DeleteOrder(int id)
    {
      int result = await _orderService.DeleteOrder(id);
      
      if(result == 0)
          return BadRequest("Order not deleted");
        
        return Ok("Order deleted");
    }
    

    [HttpGet("my-orders/{id}")]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<OrderDto>> GetAllOrders(int id)
    {
        var orders = await _orderService.GetAllOrders(id);
        return Ok(orders);
    }
    
    
    [HttpGet("my-orders")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<OrderDto>> GetOrders()
    {
        var orders = await _orderService.GetOrders();
        if (orders.Count > 0)
        {
            return Ok(orders);
        }
        else
            return BadRequest("No orders found");
    }


    [HttpGet("filter-by-status/{id}/{status}")]
    [Authorize(Roles = "Customer, Salesman")]
    public async Task<ActionResult<OrderDto>> FilterOrdersByStatus(int id, string status)
    {
       var orders = await _orderService.GetOrdersByStatus(id, status);
       return Ok(orders);
    }

}