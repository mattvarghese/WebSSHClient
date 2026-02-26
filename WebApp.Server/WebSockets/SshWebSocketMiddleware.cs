using System.Net.WebSockets;
using System.Text;
using Microsoft.Extensions.Options;
using Renci.SshNet;

public class SshWebSocketMiddleware
{
	private readonly RequestDelegate _next;

	public SshWebSocketMiddleware(RequestDelegate next)
	{
		_next = next;
	}

	public async Task InvokeAsync(HttpContext context)
	{
		if (!context.WebSockets.IsWebSocketRequest)
		{
			context.Response.StatusCode = 400;
			return;
		}

		var ws = await context.WebSockets.AcceptWebSocketAsync();

		var query = context.Request.Query;
		var host = query["host"].ToString().ToLowerInvariant();
		var username = query["username"];
		var password = query["password"];

		using var client = new SshClient(host!, username!, password!);
		try
		{
			client.Connect();
			using var stream = client.CreateShellStream("xterm", 80, 32, 800, 600, 1024);

			var promptCommandMap = new List<(string Prompt, string Command)>();

			if (host.Contains("localhost"))
			{
				// Here we're injecting keystrokes into the SSH stream!
				// If the prompt matches, then inject keystroke, so we don't inject too early.
				// This is barebones and flaky but demoable.
				promptCommandMap = new List<(string Prompt, string Command)>
				{
					( "$ ", "ls -l" ),
				};
			} 

			var outputBuffer = new StringBuilder();
			var buffer = new byte[1024];
			var promptEnumerator = promptCommandMap.GetEnumerator();
			bool hasNextPrompt = promptEnumerator.MoveNext();

			var send = Task.Run(async () =>
			{
				var inputBuffer = new byte[1024 * 4];
				while (ws.State == WebSocketState.Open)
				{
					var result = await ws.ReceiveAsync(new ArraySegment<byte>(inputBuffer), CancellationToken.None);
					if (result.MessageType == WebSocketMessageType.Close)
						break;

					var input = Encoding.UTF8.GetString(inputBuffer, 0, result.Count);
					stream.Write(input);
				}
			});


			while (ws.State == WebSocketState.Open && stream.CanRead)
			{
				var len = stream.Read(buffer, 0, buffer.Length);
				if (len > 0)
				{
					var output = Encoding.UTF8.GetString(buffer, 0, len);
					outputBuffer.Append(output);
					await ws.SendAsync(Encoding.UTF8.GetBytes(output), WebSocketMessageType.Text, true, CancellationToken.None);

					if (hasNextPrompt && outputBuffer.ToString().Contains(promptEnumerator.Current.Prompt))
					{
						stream.WriteLine(promptEnumerator.Current.Command);
						outputBuffer.Clear();
						hasNextPrompt = promptEnumerator.MoveNext();
					}
				}

				await Task.Delay(50);
			}

			await send;
		}
		catch (Exception ex)
		{
			var error = Encoding.UTF8.GetBytes("SSH Error: " + ex.Message);
			await ws.SendAsync(error, WebSocketMessageType.Text, true, CancellationToken.None);
		}
		finally
		{
			if (client.IsConnected)
				client.Disconnect();

			await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed", CancellationToken.None);
		}
	}
}
