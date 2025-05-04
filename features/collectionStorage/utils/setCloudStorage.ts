import { collectionStorage } from "./collectionStorage";
import saveCollectionsToCloud from "./saveCollectionsToCloud";

export default async function setCloudStorage(enable: boolean): Promise<void>
{
	if (enable)
	{
		await collectionStorage.disableCloud.setValue(false);
		const collections = await collectionStorage.localCollections.getValue();
		const lastUpdated = await collectionStorage.localLastUpdated.getValue();
		await saveCollectionsToCloud(collections, lastUpdated);
	}
	else
	{
		await collectionStorage.disableCloud.setValue(true);
		await saveCollectionsToCloud([], 0);
		browser.runtime.reload();
	}
}
