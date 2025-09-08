import { createAnalytics } from "@wxt-dev/analytics";
import { googleAnalytics4 } from "@wxt-dev/analytics/providers/google-analytics-4";

export const analytics = createAnalytics({
	providers:
		[
			googleAnalytics4({
				apiSecret: import.meta.env.WXT_GA4_API_SECRET,
				measurementId: import.meta.env.WXT_GA4_MEASUREMENT_ID
			})
		]
});
