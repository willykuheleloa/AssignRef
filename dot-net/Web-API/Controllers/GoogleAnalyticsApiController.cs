using Microsoft.AspNetCore.Mvc;
using Google.Apis.AnalyticsReporting.v4.Data;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using Microsoft.Extensions.Logging;
using System;
using Sabio.Services.Interfaces;
using Sabio.Models.AppSettings;
using Microsoft.Extensions.Options;

namespace Sabio.Web.Api.Controllers
    {
    [Route("api/googleanalytics")]
    [ApiController]
    public class GoogleAnalyticsApiController : BaseApiController
        {
        private IGoogleAnalyticService _googleService = null;
        
        public GoogleAnalyticsApiController(IGoogleAnalyticService service,
            ILogger<PingApiController> logger) : base(logger)
            {
            _googleService = service;
            }

        [HttpGet]
        public ActionResult<ItemResponse<GetReportsResponse>> GetReport(DateTime startDate, DateTime endDate)
            {
            int code = 200;
            BaseResponse response = null;
            try
                {
                GetReportsResponse report = _googleService.GetReport(startDate, endDate);
                response = new ItemResponse<GetReportsResponse> { Item = report };
                }
            catch (Exception ex)
                {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
                }
            return StatusCode(code, response);
            }
        }
    }
