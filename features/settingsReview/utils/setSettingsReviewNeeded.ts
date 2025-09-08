import { analyticsPermission } from "@/features/analytics";
import { Runtime } from "wxt/browser";
import { settingsForReview } from "./showSettingsReviewDialog";

export default async function setSettingsReviewNeeded(installReason: Runtime.OnInstalledReason, previousVersion?: string): Promise<void>
{
	const needsReview: string[] = await settingsForReview.getValue();

	if (!needsReview.includes(reviewSettings.ANALYTICS) && await checkAnalyticsReviewNeeded(installReason, previousVersion))
		needsReview.push(reviewSettings.ANALYTICS);

	// Add more settings here as needed

	if (needsReview.length > 0)
		await settingsForReview.setValue(needsReview);
}

export const reviewSettings =
{
	ANALYTICS: "analytics"
};

export async function checkAnalyticsReviewNeeded(installReason: Runtime.OnInstalledReason, previousVersion?: string): Promise<boolean>
{
	if (installReason === "install")
		return !await analyticsPermission.getValue();

	if (installReason === "update")
	{
		const [major, minor, patch] = (previousVersion ?? "0.0.0").split(".").map(parseInt);
		const cummulative: number = major * 10000 + minor * 100 + patch;

		if (cummulative < 30100) // < 3.1.0
			return true;
	}

	if (import.meta.env.DEV)
		return true;

	return false;
}
