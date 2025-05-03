import { CollectionItem } from "@/models/CollectionModels";
import { collectionStorage } from "./collectionStorage";
import getCollectionsFromCloud from "./getCollectionsFromCloud";
import getCollectionsFromLocal from "./getCollectionsFromLocal";
import saveCollectionsToLocal from "./saveCollectionsToLocal";
import getLogger from "@/utils/getLogger";

const logger = getLogger("getCollections");

export default async function getCollections(): Promise<[CollectionItem[], CloudStorageIssueType | null]>
{
	const lastUpdatedLocal: number = await collectionStorage.localLastUpdated.getValue();
	const lastUpdatedSync: number = await collectionStorage.syncLastUpdated.getValue();

	if (lastUpdatedLocal === lastUpdatedSync)
		return [await getCollectionsFromLocal(), null];

	if (lastUpdatedLocal > lastUpdatedSync)
		return [await getCollectionsFromLocal(), "merge_conflict"];

	try
	{
		const collections: CollectionItem[] = await getCollectionsFromCloud();
		await saveCollectionsToLocal(collections, lastUpdatedSync);

		return [collections, null];
	}
	catch (ex)
	{
		logger("Failed to get cloud storage");
		console.error(ex);
		return [await getCollectionsFromLocal(), "parse_error"];
	}
}

export type CloudStorageIssueType = "parse_error" | "merge_conflict";
