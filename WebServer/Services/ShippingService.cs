using WebServer.Interfaces;
using WebServer.Models;

namespace WebServer.Services;

public interface ISharedShippingService
{
    int GetRemainingTime(int orderId);
    void StartTimer(int durationInHours,int orderId);
    bool CancelShipment(int orderId);
}

public class SharedShippingService : ISharedShippingService
{
    private readonly Dictionary<int, Timer> _shipmentTimers = new Dictionary<int, Timer>(); // OrderId, Timer
    private readonly Dictionary<int, DateTime> _shipmentTimersStart = new Dictionary<int, DateTime>();
    private readonly IServiceProvider _serviceProvider;
    private readonly  IServiceScopeFactory _scopeFactory;
    private readonly object _lock = new object(); // Lock object

    
    private Timer _timer;
    private int _durationInMinutes;

    public SharedShippingService(IServiceProvider serviceProvider, IServiceScopeFactory scopeFactory)
    {
        _serviceProvider = serviceProvider;
        _scopeFactory = scopeFactory;
    }

    public int GetRemainingTime(int orderId)
    {
        
        if (!_shipmentTimers.ContainsKey(orderId))
        {
            UpdateState(orderId, Status.Canceled);
            return 0;
        }


        var startTime = _shipmentTimersStart[orderId];

        int elapsedMinutes = (int)(DateTime.Now - startTime).TotalMinutes;
        int remainingTime = Math.Max(0, _durationInMinutes - elapsedMinutes);
        
        return remainingTime;
    }

    public void StartTimer(int durationInMinutes, int orderId)
    {
        lock (_lock) // Acquire lock
        {
            _durationInMinutes = durationInMinutes;
       
            
            _timer = new Timer(_ => UpdateState(orderId, Status.Deliverd), null, TimeSpan.FromMinutes(durationInMinutes),
                Timeout.InfiniteTimeSpan);
            
            
            if (_shipmentTimers.ContainsKey(orderId))
            {
                _shipmentTimers[orderId] = _timer;
                _shipmentTimersStart[orderId] = DateTime.Now;
            }

            _shipmentTimers.Add(orderId, _timer);
            _shipmentTimersStart[orderId] = DateTime.Now;
        }
    }


    public bool CancelShipment(int orderId)
    {
        {
            if (_shipmentTimers.ContainsKey(orderId))
            {

                    // Dispose the timer and remove it from dictionaries
                    ResetTimers(orderId);
                    UpdateState(orderId,Status.Canceled);
                    
                    return true;
            }
            else
                return false;
        }

    }

    public void UpdateState(int orderId, Status status)
    {
        var scope = _serviceProvider.CreateScope();
        var orderService = scope.ServiceProvider.GetRequiredService<IOrderService>();
        orderService.UpdateStatus(orderId, status);
        
    }

    public void ResetTimers(int orderId)
    {
        _shipmentTimers[orderId].Dispose();
        _shipmentTimers.Remove(orderId);
        _shipmentTimersStart.Remove(orderId);

    }


}

