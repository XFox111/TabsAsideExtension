import { Unwatch, WatchCallback, WxtStorageItem } from "wxt/storage";
import { analytics } from "./analytics";
import { Permissions } from "wxt/browser";

const analyticsPermission: Pick<WxtStorageItem<boolean, Record<string, unknown>>, "getValue" | "watch" | "setValue"> =
	{
		getValue: async (): Promise<boolean> =>
		{
			const isGranted: boolean = import.meta.env.FIREFOX
				? await browser.permissions.contains({
					data_collection: ["technicalAndInteraction"]
				})
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
				});
			else
				result = await browser.permissions.remove({
					data_collection: ["technicalAndInteraction"]
				});

			if (!result)
				throw new Error("Permission request was denied");
		},

		watch: (cb: WatchCallback<boolean>): Unwatch =>
		{
			if (!import.meta.env.FIREFOX)
				return allowAnalytics.watch(cb);

			const listener = async (permissions: Permissions.Permissions): Promise<void> =>
			{
				if (permissions.data_collection?.includes("technicalAndInteraction"))
				{
					const isGranted: boolean = await browser.permissions.contains({ data_collection: ["technicalAndInteraction"] });
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
