import { trackError } from "@/features/analytics";
import { CollectionItem } from "@/models/CollectionModels";
import getLogger from "@/utils/getLogger";
import { collectionStorage } from "./collectionStorage";
import getCollectionsFromCloud from "./getCollectionsFromCloud";
import getCollectionsFromLocal from "./getCollectionsFromLocal";
import saveCollectionsToCloud from "./saveCollectionsToCloud";
import saveCollectionsToLocal from "./saveCollectionsToLocal";

const logger = getLogger("resolveConflict");

export default function resolveConflict(acceptSource: "local" | "sync"): Promise<void>
{
	if (acceptSource === "local")
		return replaceCloudWithLocal();

	return replaceLocalWithCloud();
}

async function replaceCloudWithLocal(): Promise<void>
{
	const collections: CollectionItem[] = await getCollectionsFromLocal();
	const lastUpdated: number = await collectionStorage.localLastUpdated.getValue();

	await saveCollectionsToCloud(collections, lastUpdated);
}

async function replaceLocalWithCloud(): Promise<void>
{
	try
	{
		const collections: CollectionItem[] = await getCollectionsFromCloud();
		const lastUpdated: number = await collectionStorage.syncLastUpdated.getValue();

		await saveCollectionsToLocal(collections, lastUpdated);
	}
	catch (ex)
	{
		logger("Failed to get cloud storage");
		console.error(ex);
		trackError("conflict_resolve_with_cloud_error", ex as Error);
	}
}
