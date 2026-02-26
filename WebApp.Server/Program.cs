using System.Text.Json;
using System.Text.Json.Serialization;

namespace WebApp.Server
{
	public class Program
	{
		public static void Main(string[] args)
		{
			WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

			// Options to use for JSON serialization / deserialization
			JsonSerializerOptions jsonOptions = new JsonSerializerOptions
			{
				PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
				WriteIndented = true
			};
			jsonOptions.Converters.Add(new JsonStringEnumConverter());
			builder.Services.AddSingleton(jsonOptions);

			// Add services to the container.
			builder.Services.AddControllers().AddJsonOptions(opts =>
			{
				opts.JsonSerializerOptions.PropertyNamingPolicy = jsonOptions.PropertyNamingPolicy;
				opts.JsonSerializerOptions.WriteIndented = jsonOptions.WriteIndented;

				// Copy over each converter from your shared list
				foreach (JsonConverter converter in jsonOptions.Converters)
				{
					opts.JsonSerializerOptions.Converters.Add(converter);
				}
			});

			// Add cors.
			builder.Services.AddCors(options =>
			{
				options.AddPolicy("DynamicCors", policy =>
				{
					policy
						.SetIsOriginAllowed(origin => true) // Allow any non-empty origin
						.AllowAnyHeader()
						.AllowAnyMethod()
						.AllowCredentials(); // Only use this if you need it
				});
			});

			WebApplication app = builder.Build();

			// These are required when running published
			// so that the static files are served up correctly
			app.UseDefaultFiles();
			app.UseStaticFiles();

			// Configure the HTTP request pipeline.

			app.UseHttpsRedirection();

			// Enable WebSockets
			app.UseWebSockets();

			// Map WebSocket endpoint for terminal simulation
			app.UseWhen(ctx => ctx.Request.Path.StartsWithSegments("/ws/terminal"),
				appBuilder => appBuilder.UseMiddleware<SshWebSocketMiddleware>());

			// app.UseAuthorization();

			app.UseCors("DynamicCors");

			app.MapControllers();

			// This is required if we use react-router-dom
			app.MapFallbackToFile("/index.html");

			app.Run();
		}
	}
}
