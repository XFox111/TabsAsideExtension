import { cloudDisabled, collectionCount } from "@/features/collectionStorage";
import { settings } from "@/utils/settings";
import { WxtStorageItem } from "wxt/storage";

// @ts-expect-error we don't need to implement a full storage item
const userPropertiesStorage: WxtStorageItem<Record<string, string>, any> =
{
	getValue: async (): Promise<UserProperties> =>
	{
		console.log("userPropertiesStorage.getValue");
		const properties: UserProperties =
		{
			cloud_used: await cloudDisabled.getValue() ? "-1" : (await browser.storage.sync.getBytesInUse() / 102400).toString(),
			collection_count: (await collectionCount.getValue()).toString()
		};

		for (const key of Object.keys(settings))
		{
			const value = await settings[key as keyof typeof settings].getValue();
			properties[`option_${key}`] = value.valueOf().toString();
		}

		return properties;
	},
	setValue: async () => { }
};

export default userPropertiesStorage;

export type UserProperties =
	{
		collection_count: string;
		cloud_used: string;
		[key: `option_${string}`]: string;
	};
