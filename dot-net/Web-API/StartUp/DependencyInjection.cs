using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RestSharp;
using Sabio.Data;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Services.Interfaces.Security;
using Sabio.Services.Locations;
using Sabio.Web.Api.StartUp.DependencyInjection;
using Sabio.Web.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;


namespace Sabio.Web.StartUp
{
    public class DependencyInjection
    {
        public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            if (configuration is IConfigurationRoot)
            {
                services.AddSingleton<IConfigurationRoot>(configuration as IConfigurationRoot);   // IConfigurationRoot
            }

            services.AddSingleton<IConfiguration>(configuration);   // IConfiguration explicitly

            string connString = configuration.GetConnectionString("Default");
            // https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-2.2
            // The are a number of differe Add* methods you can use. Please verify which one you
            // should be using services.AddScoped<IMyDependency, MyDependency>();

            // services.AddTransient<IOperationTransient, Operation>();

            // services.AddScoped<IOperationScoped, Operation>();

            // services.AddSingleton<IOperationSingleton, Operation>();

           
            services.AddSingleton<IAuthenticationService<int>, WebAuthenticationService>();

            services.AddSingleton<ICheckoutSessionService, CheckoutSessionService>();

            services.AddSingleton<Sabio.Data.Providers.IDataProvider, SqlDataProvider>(delegate (IServiceProvider provider)
            {
                return new SqlDataProvider(connString);
            });

            services.AddSingleton<IAnnouncementService, AnnouncementService>();
            services.AddSingleton<IAssignmentService, AssignmentService>();
            services.AddSingleton<IBaseUserMapper, UserService>();
            services.AddSingleton<IBlockDateService, BlockDateService>();
            services.AddSingleton<ICertificationResultsService, CertificationResultsService>();
            services.AddSingleton<ICandidateService, CandidateService>();
            services.AddSingleton<ICertificationsService,CertificationsService>();
            services.AddSingleton<IConferencesService, ConferencesService>();
            services.AddSingleton<ICrewOfficialsService, CrewOfficialsService>();
            services.AddSingleton<ICrewService, CrewService>();
            services.AddSingleton<IDashboardService, DashboardService>();
            services.AddSingleton<IEmailService, EmailService>();
            services.AddSingleton<IFAQService, FAQService>();
            services.AddSingleton<IFileService, FileService>();
            services.AddSingleton<IFoulService, FoulService>();
            services.AddSingleton<IGamesService, GamesService>();
            services.AddSingleton<IGameReportService, GameReportService>();
            services.AddSingleton<IGoogleAnalyticService, GoogleAnalyticService>();
            services.AddSingleton<IGradeFoulAnalyticService, GradeFoulAnalyticService>();
            services.AddSingleton<IGradeService, GradeService>();    
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IIdentityProvider<int>, WebAuthenticationService>();
            services.AddSingleton<ILocationMapper, LocationsService>();
            services.AddSingleton<ILocationsService, LocationsService>();
            services.AddSingleton<ILookUpService, LookUpService>();
            services.AddSingleton<IMapBaseConference, ConferencesService>();
            services.AddSingleton<IMapBaseSeason, SeasonService>();
            services.AddSingleton<IMapFile, FileService>();
            services.AddSingleton<IMapGame, GamesService>();
            services.AddSingleton<IMapGameReport, GameReportService>();
            services.AddSingleton<IMessageService, MessageService>();
            services.AddSingleton<INewsletterSubscriptionService, NewsletterSubscriptionService>();
            services.AddSingleton<IOfficialService, OfficialService>();
            services.AddSingleton<IOfficialsConflictsService, OfficialsConflictsService>();
            services.AddSingleton<IPageSectionService, PageSectionService>();
            services.AddSingleton<IPageTranslationService, PageTranslationService>();
            services.AddSingleton<IReplayEntryService, ReplayEntryService>(); 
            services.AddSingleton<IPodcastService, PodcastService>();
            services.AddSingleton<IResourceService, ResourceService>();
            services.AddSingleton<IRestClient, RestClient>();
            services.AddSingleton<ISeasonService, SeasonService>();
            services.AddSingleton<ISiteReferenceService, SiteReferenceService>();
            services.AddSingleton<IStripeAccountService, StripeAccountService>();
            services.AddSingleton<IStripeSubscriptionService, StripeSubscriptionService>();
            services.AddSingleton<ITeamMemberService, TeamMemberService>();
            services.AddSingleton<ITeamService, TeamService>();
            services.AddSingleton<ITestAnswersService, TestAnswersService>();
            services.AddSingleton<ITestInstancesService, TestInstanceService>();
            services.AddSingleton<ITestQuestionAnswerOptionService, TestQuestionAnswerOptionService>();
            services.AddSingleton<ITestQuestionsService, TestQuestionsService>();
            services.AddSingleton<ITestService, TestService>();
            services.AddSingleton<ITrainingVideoService, TrainingVideoService>();
            services.AddSingleton<IUsersApparelSizesService, UsersApparelSizesService>();
            services.AddSingleton<IUserService, UserService>();
            services.AddSingleton<IVenuesService, VenuesService>();
            services.AddSingleton<IVideoCategoryService, VideoCategoryService>();
            services.AddSingleton<IPageSectionService, PageSectionService>();
            
           
            services.AddSingleton<IVideoCategoryService, VideoCategoryService>();
            services.AddSingleton<IZoomService, ZoomService>();

            GetAllEntities().ForEach(tt =>
            {
                //This will not error by way of being null. BUT if the code within the method does
                // then we would rather have the error loadly on startup then worry about debuging the issues as it runs
                IConfigureDependencyInjection idi = Activator.CreateInstance(tt) as IConfigureDependencyInjection;

                idi.ConfigureServices(services, configuration);
            });
        }

        public static List<Type> GetAllEntities()
        {
            return AppDomain.CurrentDomain.GetAssemblies().SelectMany(x => x.GetTypes())
                 .Where(x => typeof(IConfigureDependencyInjection).IsAssignableFrom(x) && !x.IsInterface && !x.IsAbstract)
                 .ToList();
        }

        public static void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
        }
    }
}