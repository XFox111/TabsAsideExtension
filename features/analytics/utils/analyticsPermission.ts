import { Unwatch, WatchCallback } from "wxt/utils/storage";
import { analytics } from "./analytics";

const analyticsPermission: Pick<WxtStorageItem<boolean, Record<string, unknown>>, "getValue" | "watch" | "setValue"> =
	{
		getValue: async (): Promise<boolean> =>
		{
			const isGranted: boolean = import.meta.env.FIREFOX
				? await browser.permissions.contains({
					data_collection: ["technicalAndInteraction"]
				} as Browser.permissions.Permissions)
				: await allowAnalytics.getValue();

			analytics.setEnabled(isGranted);

			return isGranted;
		},

		setValue: async (value: boolean) =>
		{
			if (!import.meta.env.FIREFOX)
			{
				await allowAnalytics.setValue(value);
				return;
			}

			let result: boolean = false;

			if (value)
				result = await browser.permissions.request({
					data_collection: ["technicalAndInteraction"]
				} as Browser.permissions.Permissions);
			else
				result = await browser.permissions.remove({
					data_collection: ["technicalAndInteraction"]
				} as Browser.permissions.Permissions);

			if (!result)
				throw new Error("Permission request was denied");
		},

		watch: (cb: WatchCallback<boolean>): Unwatch =>
		{
			if (!import.meta.env.FIREFOX)
				return allowAnalytics.watch(cb);

			const listener = async (permissions: Browser.permissions.Permissions): Promise<void> =>
			{
				// @ts-expect-error Firefox-only API
				if (permissions.data_collection?.includes("technicalAndInteraction"))
				{
					const isGranted: boolean = await browser.permissions.contains({
						data_collection: ["technicalAndInteraction"]
					} as Browser.permissions.Permissions);
					cb(isGranted, !isGranted);
				}
			};

			browser.permissions.onAdded.addListener(listener);
			browser.permissions.onRemoved.addListener(listener);

			return (): void =>
			{
				browser.permissions.onAdded.removeListener(listener);
				browser.permissions.onRemoved.removeListener(listener);
			};
		}
	};

export default analyticsPermission;

const allowAnalytics = storage.defineItem<boolean>("local:analytics", {
	fallback: true
});
