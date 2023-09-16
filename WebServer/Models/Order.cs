using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebServer.Models;

public enum Status
{
    Pending,
    Deliverd,
    Canceled
}

public class Order
{

    public int Id { get; set; }
    public float TotalAmount { get; set; }
    public DateTime OrderDate { get; set; }
    public User Customer { get; set; }
    public int CustomerId { get; set; }
    public Status Status { get; set; }
    public float TimeToDelivery { get; set; }
    public List<OrderItem> OrderItems { get; set; }
    public string Address { get; set; }
    public string Comment { get; set; }
    public string OrderCreationTime { get; set; }



}