export default function track(eventName: string, eventProperties?: Record<string, string>): void
{
	try
	{
		analytics.track(eventName, eventProperties);
	}
	catch (ex)
	{
		console.error("Failed to send analytics event", ex);
	}
}
