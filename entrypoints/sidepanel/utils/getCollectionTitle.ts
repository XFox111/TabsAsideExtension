import { CollectionItem } from "@/models/CollectionModels";

export function getCollectionTitle(collection?: CollectionItem, useTimestamp?: boolean): string
{
	if (collection?.title !== undefined && useTimestamp !== true)
		return collection.title;

	return new Date(collection?.timestamp ?? Date.now())
		.toLocaleDateString(browser.i18n.getUILanguage(), { year: "numeric", month: "short", day: "numeric" });
}
