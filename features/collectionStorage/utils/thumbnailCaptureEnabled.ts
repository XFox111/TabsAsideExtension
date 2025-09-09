import { Permissions } from "wxt/browser";
import { Unwatch, WatchCallback, WxtStorageItem } from "wxt/storage";

const thumbnailCaptureEnabled: Pick<WxtStorageItem<boolean, Record<string, unknown>>, "getValue" | "watch" | "setValue"> =
	{
		getValue: async (): Promise<boolean> =>
			await browser.permissions.contains({ permissions: ["scripting"], origins: ["<all_urls>"] }),

		watch: (cb: WatchCallback<boolean>): Unwatch =>
		{
			const listener = async (permissions: Permissions.Permissions): Promise<void> =>
			{
				if (permissions.permissions?.includes("scripting") || permissions.origins?.includes("<all_urls>"))
				{
					const isGranted: boolean = await browser.permissions.contains({ permissions: ["scripting"], origins: ["<all_urls>"] });
					console.log("thumbnailCaptureEnabled changed", isGranted);
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
		},

		setValue: async (value: boolean): Promise<void> =>
		{
			let result: boolean = false;

			if (value)
				result = await browser.permissions.request({ permissions: ["scripting"], origins: ["<all_urls>"] });
			else
			{
				result = await browser.permissions.remove({ origins: ["<all_urls>"] });

				if (import.meta.env.DEV)
					await browser.permissions.request({ origins: ["http://localhost/*"] });
			}

			if (!result)
				throw new Error("Permission request was denied");
		}
	};

export default thumbnailCaptureEnabled;
