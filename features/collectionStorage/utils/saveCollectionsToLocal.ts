import { CollectionItem } from "@/models/CollectionModels";
import { collectionStorage } from "./collectionStorage";

export default async function saveCollectionsToLocal(collections: CollectionItem[], timestamp: number): Promise<void>
{
	await collectionStorage.localCollections.setValue(collections);
	await collectionStorage.count.setValue(collections.length);
	await collectionStorage.localLastUpdated.setValue(timestamp);
}
