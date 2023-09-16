using Quartz;
using Quartz.Spi;

namespace WebServer;

public class DependecyInjectionJobFactory : IJobFactory
{
    private readonly IServiceProvider _serviceProvider;

    public DependecyInjectionJobFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public IJob NewJob(TriggerFiredBundle bundle, IScheduler scheduler)
    {
        return _serviceProvider.GetRequiredService(bundle.JobDetail.JobType) as IJob;
    }

    public void ReturnJob(IJob job)
    {
        // If needed, you can release resources or perform cleanup here
    }
}