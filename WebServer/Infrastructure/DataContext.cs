using Microsoft.EntityFrameworkCore;
using WebServer.Models;

namespace WebServer.Data;

public class DataContext : DbContext
{
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    
    
    public DataContext() {}
    
    
    public DataContext(DbContextOptions options) :base(options) {}
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Address>(entity =>
        {
            entity.ToTable("Addresses");
            entity.HasKey(e => e.AddressId);
            entity.Property(e => e.AddressId).HasColumnName("AddressId").ValueGeneratedOnAdd();
            entity.Property(e => e.Street).IsRequired();
            entity.Property(e => e.StreetNumber).IsRequired();
            entity.Property(e => e.City).IsRequired();
            entity.Property(e => e.PostCode).IsRequired();
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.UserId);

            entity.Property(e => e.UserId).HasColumnName("UserId").ValueGeneratedOnAdd();
            entity.Property(e => e.Username).IsRequired();
            entity.Property(e => e.Email).IsRequired();
            entity.Property(e => e.Password).IsRequired();
            entity.Property(e => e.FullName).IsRequired();
            entity.Property(e => e.Birthday).IsRequired();
            entity.Property(e => e.Verified).IsRequired();
            entity.Property(e => e.ImageName);
            entity.HasOne<Address>(e => e.Address)
                .WithOne()
                .HasForeignKey<User>(a => a.AddressId);

            entity.Ignore(user => user.ImageFile);
            entity.Ignore(user => user.ImageSrc);
        });
        
        
        modelBuilder.Entity<Article>(entity =>
        {
            entity.ToTable("Articles");
            entity.HasKey(e => e.ArticleId);
            
            entity.Property(article => article.ArticleId).HasColumnName("ArticleId").ValueGeneratedOnAdd();
            entity.Property(article => article.Type).IsRequired();
            entity.Property(article => article.Name).IsRequired();
            entity.Property(article => article.Price).IsRequired();
            entity.Property(article => article.Description);
            entity.Property(article => article.ImageName);
            
            entity.Ignore(user => user.ImageFile);
            entity.Ignore(user => user.ImageSrc);
            
            entity.HasOne<User>(article=>article.Salesman)
                .WithMany()
                .HasForeignKey(article=> article.SalesmanId)
                .IsRequired();

        });
        
        
        
        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("Orders");
            entity.HasKey(order => order.Id);
            
            entity.Property(order => order.Id).HasColumnName("Id").ValueGeneratedOnAdd();
            entity.Property(order => order.TotalAmount).IsRequired();
            entity.Property(order => order.OrderDate).IsRequired();
            entity.Property(order => order.Status).IsRequired();
            entity.Property(order => order.Address).IsRequired();
            entity.Property(order => order.TimeToDelivery).IsRequired();
            entity.Property(order => order.Comment);
            entity.Property(order => order.Comment);
            entity.Property(order => order.OrderCreationTime);
            

            entity.HasOne<User>(order=>order.Customer)
                .WithMany()
                .HasForeignKey(order=> order.CustomerId)
                .IsRequired();  
            
            
        });
        
        
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.ToTable("OrdersItems");
            entity.HasKey(orderItem => orderItem.Id);
            
            entity.Property(orderItem => orderItem.Id).HasColumnName("Id").ValueGeneratedOnAdd();
            entity.Property(orderItem => orderItem.ArticleId).IsRequired();
            entity.Property(orderItem => orderItem.Quantity).IsRequired();
            entity.Property(orderItem => orderItem.ArticlePrice).IsRequired();


            entity.HasOne<Article>(orderItem=>orderItem.Article)
                .WithMany()
                .HasForeignKey(orderItem=> orderItem.ArticleId)
                .IsRequired();

            
        });
        
        
    }
    

}