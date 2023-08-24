using Google.Apis.AnalyticsReporting.v4.Data;
using System;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IGoogleAnalyticService
    {
        GetReportsResponse GetReport(DateTime startDate, DateTime endDate);
    }
}