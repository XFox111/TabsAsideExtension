import { CollectionItem, GraphicsStorage } from "@/models/CollectionModels";

export const collectionStorage =
{
	chunkCount: storage.defineItem<number>("sync:chunkCount", { fallback: 0 }),
	syncLastUpdated: storage.defineItem<number>("sync:lastUpdated", { fallback: 0 }),
	localLastUpdated: storage.defineItem<number>("local:lastUpdated", { fallback: 0 }),
	localCollections: storage.defineItem<CollectionItem[]>("local:collections", { fallback: [] }),
	count: storage.defineItem<number>("local:count", { fallback: 0 }),
	graphics: storage.defineItem<GraphicsStorage>("local:graphics", { fallback: {} }),
	maxChunkCount: 12
};
