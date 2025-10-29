import { trackError } from "@/features/analytics";
import { CollectionItem, GraphicsStorage } from "@/models/CollectionModels";
import getLogger from "@/utils/getLogger";
import sendNotification from "@/utils/sendNotification";
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
		try
		{
			await saveCollectionsToCloud(collections, timestamp);
		}
		catch (ex)
		{
			logger("Failed to save cloud storage");
			console.error(ex);
			trackError("cloud_save_error", ex as Error);

			if ((ex as Error).message.includes("MAX_WRITE_OPERATIONS_PER_MINUTE"))
				await sendNotification({
					title: i18n.t("notifications.error_quota_exceeded.title"),
					message: i18n.t("notifications.error_quota_exceeded.message"),
					icon: "/notification_icons/cloud_error.png"
				});
			else
				await sendNotification({
					title: i18n.t("notifications.error_storage_full.title"),
					message: i18n.t("notifications.error_storage_full.message"),
					icon: "/notification_icons/cloud_error.png"
				});
		}

	await updateGraphics(collections, graphicsCache);
	logger("Save complete");
};
