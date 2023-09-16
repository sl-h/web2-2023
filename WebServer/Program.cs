using System.Configuration;
using System.Net.Mime;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Quartz;
using Quartz.Spi;
using Swashbuckle.AspNetCore.Filters;
using WebServer;
using WebServer.Data;
using WebServer.Repository;
using WebServer.Interfaces;
using WebServer.Middleware;
using WebServer.Services;
using WebServer.Services.Email;



var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");


#region Services

builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));


#region Repositories
builder.Services.AddTransient<UpdateOrderStatusJob>();
builder.Services.AddSingleton<IJobFactory, DependecyInjectionJobFactory>();

builder.Services.AddTransient(typeof(IDbService<>), typeof(DbService<>));
builder.Services.AddTransient<IArticleRepository,ArticleRepository>();
builder.Services.AddTransient<IUsersRepository,UsersRepository>();
builder.Services.AddTransient<IOrderRepository,OrderRepository>();
builder.Services.AddTransient<IUnitOfWork,UnitOfWork>();
#endregion

#region ControllerServices
builder.Services.AddQuartz(q =>
{
    q.UseMicrosoftDependencyInjectionJobFactory();
});
builder.Services.AddQuartzHostedService(options =>
{
    options.WaitForJobsToComplete = true;
});


builder.Services.AddControllers()
    .AddJsonOptions(opt=> { opt.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); });

builder.Services.AddScoped<IUserService,UserService>();
builder.Services.AddScoped<IArticleService,ArticleService>();
builder.Services.AddScoped<IOrderService,OrderService>();

builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddSingleton<ISharedShippingService, SharedShippingService>();

#endregion


builder.Services.AddSingleton<JwtService>();
builder.Services.AddAuthentication(opt =>
    {
        opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"])),

        };
    })
    .AddGoogle(options =>
    {
        options.ClientId = builder.Configuration["Google:ClientId"];
        options.ClientSecret = builder.Configuration["Google:ClientSecret"];
    });


#region SwagerService

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "WebServer",
        Version = "v1",
    });

    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Standard Authorization header using the Bearer scheme. Example: \"bearer {token}\"",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });
    
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>( true, "oauth2" );
});

#endregion


builder.Services.AddCors(o =>
{
    o.AddPolicy("CorsPolicy", policy =>  
             policy.WithOrigins("http://localhost:3000") 
             // policy.AllowAnyOrigin()
             .AllowAnyMethod()
             .AllowCredentials()
             .AllowAnyHeader()
             .WithExposedHeaders("Referrer-Policy"));
});
builder.Services.AddAutoMapper(typeof(Program).Assembly);

#endregion


var app = builder.Build();
app.UseCors("CorsPolicy");
app.UseRouting(); 
app.UseAuthentication();
app.UseAuthorization();

//make images accessible via url path
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Images")),
        RequestPath = "/Images",
    
});




if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.UseMiddleware<AuthMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();


app.Run();