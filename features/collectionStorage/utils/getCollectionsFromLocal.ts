import { CollectionItem } from "@/models/CollectionModels";
import { collectionStorage } from "./collectionStorage";

export default async function getCollectionsFromLocal(): Promise<CollectionItem[]>
{
	return await collectionStorage.localCollections.getValue();
}
