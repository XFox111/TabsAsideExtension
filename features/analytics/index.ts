import { analytics } from "./utils/analytics";
import analyticsPermission from "./utils/analyticsPermission";
import { getUserProperties, userId } from "./utils/getUserProperties";

export { analyticsPermission };

export async function track(eventName: string, eventProperties?: Record<string, string>): Promise<void>
{
	try
	{
		if (!await analyticsPermission.getValue())
			return;

		analytics.track(eventName, eventProperties);
	}
	catch (ex)
	{
		console.error("Failed to send analytics event", ex);
	}
}

export async function trackError(name: string, error: Error): Promise<void>
{
	try
	{
		if (!await analyticsPermission.getValue())
			return;

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

export async function trackPage(pageName: string): Promise<void>
{
	try
	{
		if (!await analyticsPermission.getValue())
			return;

		analytics.identify(await userId.getValue() as string, await getUserProperties());
		analytics.page(pageName);
	}
	catch (ex)
	{
		console.error("Failed to send page view", ex);
	}
}
