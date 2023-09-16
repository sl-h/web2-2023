using WebServer.Models;

namespace WebServer.DTOs;

public class OrderDto
{

    public int Id { get; set; }
    public int CustomerId { get; set; }
    public float TotalAmount { get; set; }
    public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();
    public string Address { get; set; }
    public string Comment { get; set; }
    
    public DateTime OrderDate { get; set; }
    public Status Status { get; set; }

    public float TimeToDelivery { get; set; }
    public string OrderCreationTime { get; set; }

}