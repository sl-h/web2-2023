namespace WebServer.Models;

public class OrderItem
{
    public int Id { get; set; }
    public int ArticleId { get; set; }
    public int Quantity{ get; set; }
    public Article Article { get; set; }

    public float ArticlePrice { get; set; }

    public int OrderId { get; set; }
}