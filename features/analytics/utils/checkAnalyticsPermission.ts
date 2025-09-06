import { analytics } from "./analytics";

export async function checkAnalyticsPermission(): Promise<boolean>
{
	const isGranted: boolean = import.meta.env.FIREFOX
		? await browser.permissions.contains({
			// @ts-expect-error Introduced in Firefox 139
			data_collection: ["technicalAndInteraction"]
		})
		: await allowAnalytics.getValue();

	analytics.setEnabled(isGranted);

	return isGranted;
}

export async function setAnalyticsPermission(allowed: boolean): Promise<boolean>
{
	if (!import.meta.env.FIREFOX)
	{
		await allowAnalytics.setValue(allowed);
		return allowed;
	}

	if (allowed)
		return await browser.permissions.request({
			// @ts-expect-error Introduced in Firefox 139
			data_collection: ["technicalAndInteraction"]
		});
	else
		return !await browser.permissions.remove({
			// @ts-expect-error Introduced in Firefox 139
			data_collection: ["technicalAndInteraction"]
		});
}

const allowAnalytics = storage.defineItem<boolean>("local:analytics", {
	fallback: true
});
