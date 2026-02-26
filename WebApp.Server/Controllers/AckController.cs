using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace WebApp.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AckController() : ControllerBase()
	{
		[HttpGet]
		public IActionResult GetAck()
		{
			return Ok("Backend listening..");
		}
	}
}
