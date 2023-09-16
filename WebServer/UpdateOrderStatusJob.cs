using Quartz;
using WebServer.Interfaces;
using WebServer.Models;

namespace WebServer;

public class UpdateOrderStatusJob : IJob
{
    private readonly ILogger<UpdateOrderStatusJob> _logger;
    private readonly IServiceProvider _serviceProvider;

   

    public UpdateOrderStatusJob(ILogger<UpdateOrderStatusJob> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        int orderId = context.JobDetail.JobDataMap.GetInt("OrderId");
        _logger.LogInformation($"Updating status for Order ID: {orderId}");

        // Access the scheduler if needed
        var scheduler = context.Scheduler;

        // Update the order status
        using (var scope = _serviceProvider.CreateScope())
        {
            var orderService = scope.ServiceProvider.GetRequiredService<IOrderService>();
            //await orderService.UpdateStatus(orderId);
        }
    }
}