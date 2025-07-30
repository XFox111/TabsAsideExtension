import { googleAnalytics4 } from "@wxt-dev/analytics/providers/google-analytics-4";
import { WxtAppConfig } from "wxt/sandbox";
import { userPropertiesStorage } from "./features/analytics";

export default defineAppConfig({
	analytics:
	{
		debug: import.meta.env.DEV,
		enabled: storage.defineItem("local:analytics", {
			fallback: true
		}),
		userId: storage.defineItem("local:userId", {
			init: () => crypto.randomUUID()
		}),
		userProperties: userPropertiesStorage,
		providers:
			[
				googleAnalytics4({
					apiSecret: import.meta.env.WXT_GA4_API_SECRET,
					measurementId: import.meta.env.WXT_GA4_MEASUREMENT_ID
				})
			]
	}
} as WxtAppConfig);
