import { cloudDisabled, collectionCount } from "@/features/collectionStorage";
import { settings } from "@/utils/settings";

export async function getUserProperties(): Promise<UserProperties>
{
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
}

export const userId = storage.defineItem("local:userId", {
	init: () => crypto.randomUUID()
});

export type UserProperties =
	{
		collection_count: string;
		cloud_used: string;
		[key: `option_${string}`]: string;
	};
