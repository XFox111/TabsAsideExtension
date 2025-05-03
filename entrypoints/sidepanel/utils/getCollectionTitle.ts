import { CollectionItem } from "@/models/CollectionModels";

export function getCollectionTitle(collection?: CollectionItem): string
{
	return collection?.title
		|| new Date(collection?.timestamp ?? Date.now())
			.toLocaleDateString(browser.i18n.getUILanguage(), { year: "numeric", month: "short", day: "numeric" });
}
