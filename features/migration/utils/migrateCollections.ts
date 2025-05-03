import { CollectionItem, GraphicsStorage, TabItem } from "@/models/CollectionModels";
import { LegacyCollection } from "../models/LegacyModels";

export default function migrateCollections(legacyCollections: LegacyCollection[]): [CollectionItem[], GraphicsStorage]
{
	const collections: CollectionItem[] = [];
	const graphics: GraphicsStorage = {};

	for (let i = 0; i < legacyCollections.length; i++)
	{
		const legacyCollection: LegacyCollection = legacyCollections[i];
		const items: TabItem[] = legacyCollection.links.map((url, index) =>
		{
			const title: string | undefined = legacyCollection.titles[index];
			const icon: string | undefined = legacyCollection.icons?.[index];
			const preview: string | undefined = legacyCollection.thumbnails?.[index];

			if (!graphics[url])
				graphics[url] = { icon, preview };
			else
				graphics[url] = { icon: graphics[url].icon ?? icon, preview: graphics[url].preview ?? preview };

			return {
				type: "tab",
				url,
				title
			};
		});

		collections.push({
			type: "collection",
			timestamp: legacyCollection.timestamp,
			items
		});
	}

	return [collections, graphics];
}
