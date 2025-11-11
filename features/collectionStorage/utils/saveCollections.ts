import { CollectionItem, GraphicsStorage } from "@/models/CollectionModels";
import getLogger from "@/utils/getLogger";
import { collectionStorage } from "./collectionStorage";
import saveCollectionsToCloud from "./saveCollectionsToCloud";
import saveCollectionsToLocal from "./saveCollectionsToLocal";
import updateGraphics from "./updateGraphics";

const logger = getLogger("saveCollections");

export default async function saveCollections(
	collections: CollectionItem[],
	updateCloud: boolean = true,
	graphicsCache?: GraphicsStorage
): Promise<void>
{
	const timestamp: number = Date.now();
	await saveCollectionsToLocal(collections, timestamp);

	if (updateCloud && await collectionStorage.disableCloud.getValue() !== true)
		await saveCollectionsToCloud(collections, timestamp);

	await updateGraphics(collections, graphicsCache);
	logger("Save complete");
};
