import { analyticsPermission } from "@/features/analytics";
import { settingsForReview } from "./showSettingsReviewDialog";

export default async function setSettingsReviewNeeded(installReason: `${Browser.runtime.OnInstalledReason}`, previousVersion?: string): Promise<void>
{
	const needsReview: string[] = await settingsForReview.getValue();

	if (!needsReview.includes(reviewSettings.ANALYTICS) && await checkAnalyticsReviewNeeded(installReason, previousVersion))
		needsReview.push(reviewSettings.ANALYTICS);

	if (!needsReview.includes(reviewSettings.THUMBNAILS) && await checkThumbnailsReviewNeeded(installReason, previousVersion))
		needsReview.push(reviewSettings.THUMBNAILS);

	console.log("Settings needing review:", needsReview);
	// Add more settings here as needed

	if (needsReview.length > 0)
		await settingsForReview.setValue(needsReview);
}

export const reviewSettings =
{
	ANALYTICS: "analytics",
	THUMBNAILS: "thumbnails"
};

async function checkAnalyticsReviewNeeded(installReason: `${Browser.runtime.OnInstalledReason}`, previousVersion?: string): Promise<boolean>
{
	if (installReason === "install")
		return !await analyticsPermission.getValue();

	if (installReason === "update")
	{
		const [major, minor, patch] = (previousVersion ?? "0.0.0").split(".").map(parseInt);
		const cumulative: number = major * 10000 + minor * 100 + patch;

		if (cumulative < 30100) // < 3.1.0
			return true;
	}

	if (import.meta.env.DEV)
		return true;

	return false;
}

async function checkThumbnailsReviewNeeded(installReason: `${Browser.runtime.OnInstalledReason}`, previousVersion?: string): Promise<boolean>
{
	if (installReason === "install")
		return true;

	if (installReason === "update")
	{
		const [major, minor, patch] = (previousVersion ?? "0.0.0").split(".").map(parseInt);
		const cumulative: number = major * 10000 + minor * 100 + patch;

		if (cumulative < 30100) // < 3.1.0
			return true;
	}

	if (import.meta.env.DEV)
		return true;

	return false;
}
