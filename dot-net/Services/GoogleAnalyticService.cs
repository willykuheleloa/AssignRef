using Google.Apis.AnalyticsReporting.v4;
using Google.Apis.AnalyticsReporting.v4.Data;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Sabio.Models.AppSettings;
using Sabio.Models.Domain.Google;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;

namespace Sabio.Services
    {
    public class GoogleAnalyticService : IGoogleAnalyticService
        {
        private GoogleAnalyticsViewId _viewId;
        public GoogleAnalyticService(IOptions<GoogleAnalyticsViewId> viewId)
            {
            _viewId = viewId.Value;
            }
        public GetReportsResponse GetReport(DateTime startDate, DateTime endDate)
            {
            string credPath = Path.Combine("wwwroot", "googleAnalyticsAPI.json");
            string file = System.IO.File.ReadAllText(credPath);
            var credentials = JsonConvert.DeserializeObject<PersonalServiceAccountCred>(file);

            var xCred = new ServiceAccountCredential(new ServiceAccountCredential.Initializer(credentials.client_email)
                {
                Scopes = new[] { AnalyticsReportingService.Scope.AnalyticsReadonly }
                }.FromPrivateKey(credentials.private_key));
             
            using (var service = new AnalyticsReportingService(
                new BaseClientService.Initializer
                    {
                    HttpClientInitializer = xCred,
                    ApplicationName = "Assign-Ref"
                    }))
                {
                DateRange dateRange = new DateRange { StartDate = startDate.ToString("yyyy-MM-dd"), EndDate = endDate.ToString("yyyy-MM-dd") };
                Metric sessions = new Metric { Expression = "ga:sessions", Alias = "Sessions" };
                Metric pageViews = new Metric { Expression = "ga:pageViews", Alias = "Page Views" };
                Metric user = new Metric { Expression = "ga:users", Alias = "Users" };
                Dimension browser = new Dimension { Name = "ga:browser" };
                Dimension dateDimension = new Dimension { Name = "ga:date" };
                Dimension dayDimension = new Dimension { Name = "ga:dayOfWeekName" };
                Dimension pagePath = new Dimension { Name = "ga:pagePath" };
                Dimension country = new Dimension { Name = "ga:country" };

                var sessionReport = new ReportRequest
                    {
                    ViewId = _viewId.ViewId,
                    DateRanges = new List<DateRange> { dateRange },
                    Metrics = new List<Metric> { sessions },
                    Dimensions = new List<Dimension> { dateDimension, browser, dayDimension }
                    };
                
                var pageViewsReport = new ReportRequest
                    {
                    ViewId = _viewId.ViewId,
                    DateRanges = new List<DateRange> { dateRange },
                    Metrics = new List<Metric> { pageViews },
                    Dimensions = new List<Dimension> { pagePath }
                    };
               
                var userByCountry = new ReportRequest
                    {
                    ViewId = _viewId.ViewId,
                    DateRanges = new List<DateRange> { dateRange },
                    Metrics = new List<Metric> { user },
                    Dimensions = new List<Dimension> {  country }
                    };

                List<ReportRequest> requests = new List<ReportRequest>();
                requests.Add(sessionReport);
                requests.Add(pageViewsReport);
                requests.Add(userByCountry);
                var getReportsRequest = new GetReportsRequest { ReportRequests = new List<ReportRequest> { sessionReport, pageViewsReport, userByCountry} };
                GetReportsResponse response = service.Reports.BatchGet(getReportsRequest).Execute();
                return response;
                }
            }
    }
}