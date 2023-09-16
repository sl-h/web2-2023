using AutoMapper;
using Quartz;
using Quartz.Impl;
using WebServer.DTOs;
using WebServer.Errors;
using WebServer.Interfaces;
using WebServer.Models;
using WebServer.Repository;

namespace WebServer.Services;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly JwtService _jwtService;
    private readonly IMapper _dtoMapper;
    private IServiceProvider _serviceProvider;
    private ISharedShippingService _shipmentService;

    public OrderService(IUnitOfWork unitOfWork,
        JwtService jwtService,
        IMapper dtoMapper,
        IServiceProvider serviceProvider,
        ISharedShippingService shippingService)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _dtoMapper = dtoMapper;
        _serviceProvider = serviceProvider;
        _shipmentService = shippingService;
    }

    public async Task<int> CreateOrder(OrderDto request)
    {
        try
        {
            var order = _dtoMapper.Map<Order>(request);

            Random random = new Random();
            order.TimeToDelivery = random.Next(60, 120);
            order.OrderCreationTime = order.TimeToDelivery.ToString();
            await _unitOfWork.Orders.Add(order);
            int result = _unitOfWork.SaveChanges();


            _shipmentService.StartTimer((int)order.TimeToDelivery, order.Id);
            return result;
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
        }

        return 0;
    }


    public async Task UpdateStatus(int id, Status status)
    {
        try
        {
            var order = await _unitOfWork.Orders.FindOne(order => order.Id == id);
            if (order == null)
                throw new Exception("Order not found");

            if (order.Status != Status.Pending)
                return;

            order.Status = status;
            order.TimeToDelivery = 0;
            int result = _unitOfWork.SaveChanges();
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
        }
    }

    private async void CalculateOrderPrice(Order order)
    {
        try
        {
            order.TotalAmount = 0;
            foreach (var item in order.OrderItems)
            {
                var article = await _unitOfWork.Articles.GetById(item.ArticleId);
                order.TotalAmount += article.Price * item.Quantity;
                item.ArticlePrice = article.Price;
            }
        }
        catch (Exception e)
        {
            throw new Exception("Couldn't calculate order price");
        }
    }


    public async Task<List<OrderDto>> GetAllOrders(int userId)
    {
        var orders = await _unitOfWork.Orders.Find(order => order.CustomerId == userId);
        foreach (var order in orders)
        {
            order.OrderItems = _unitOfWork.Orders.GetOrderItems(order.Id);
            order.TimeToDelivery = _shipmentService.GetRemainingTime(order.Id);
        }

        var ordersDtos = orders.Select(order => _dtoMapper.Map<OrderDto>(order));
        return ordersDtos.ToList();
    }


    public async Task<List<OrderDto>> GetOrders()
    {
        var orders = await _unitOfWork.Orders.GetAll();
        foreach (var order in orders)
        {
            order.OrderItems = _unitOfWork.Orders.GetOrderItems(order.Id);
            order.TimeToDelivery = _shipmentService.GetRemainingTime(order.Id);
        }

        var ordersDtos = orders.Select(order => _dtoMapper.Map<OrderDto>(order));
        return ordersDtos.ToList();
    }


    public async Task<List<OrderDto>> GetOrdersByStatus(int id, string status)
    {
        List<Order> filterdOrders = new List<Order>();
        IEnumerable<Order> orders;


        //filter orders by status
        if (Enum.TryParse<Status>(status, out Status orderStatus))
        {
            orders = await _unitOfWork.Orders.Find(order => order.Status == orderStatus);
        }
        else
        {
            orders = await _unitOfWork.Orders.Find(order => order.Status != Status.Pending);
        }


        //find order items of an order
        foreach (var order in orders)
        {
            order.OrderItems = _unitOfWork.Orders.GetOrderItems(order.Id);

            foreach (var item in order.OrderItems)
            {
                var article = await _unitOfWork.Articles.GetById(item.ArticleId);
                if (article.SalesmanId == id)
                    filterdOrders.Add(order);
            }

            order.TimeToDelivery = _shipmentService.GetRemainingTime(order.Id);
        }

        var ordersDtos = filterdOrders.Select(order => _dtoMapper.Map<OrderDto>(order));
        return ordersDtos.ToList();
    }


    public async Task<int> DeleteOrder(int id)
    {
        var order = await _unitOfWork.Orders.GetById(id);

        if (order == null)
            throw new ItemNotFoundException(id);

        var result = _shipmentService.CancelShipment(order.Id);

        return _unitOfWork.SaveChanges();
    }
}