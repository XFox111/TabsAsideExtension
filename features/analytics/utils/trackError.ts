export default function trackError(name: string, error: Error): void
{
	try
	{
		analytics.track(name, {
			name: error.name,
			message: error.message,
			stack: error.stack ?? "no_stack"
		});
	}
	catch (ex)
	{
		console.error("Failed to send error report", ex);
	}
}
