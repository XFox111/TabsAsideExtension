import { CollectionItem } from "@/models/CollectionModels";
import { compress } from "lzutf8";
import { WxtStorageItem } from "wxt/storage";
import { collectionStorage } from "./collectionStorage";
import getChunkKeys from "./getChunkKeys";
import serializeCollections from "./serializeCollections";

export default async function saveCollectionsToCloud(collections: CollectionItem[], timestamp: number): Promise<void>
{
	if (!collections || collections.length < 1)
	{
		await collectionStorage.chunkCount.setValue(0);
		await browser.storage.sync.remove(getChunkKeys());
		return;
	}

	const data: string = compress(serializeCollections(collections), { outputEncoding: "StorageBinaryString" });
	const chunks: string[] = splitIntoChunks(data);

	if (chunks.length > collectionStorage.maxChunkCount)
		throw new Error("Data is too large to be stored in sync storage.");

	// Since there's a limit for cloud write operations, we need to write all chunks in one go.
	const newRecords: Record<string, string | number> =
	{
		[getStorageKey(collectionStorage.chunkCount)]: chunks.length,
		[getStorageKey(collectionStorage.syncLastUpdated)]: timestamp
	};

	for (let i = 0; i < chunks.length; i++)
		newRecords[`c${i}`] = chunks[i];

	await browser.storage.sync.set(newRecords);

	if (chunks.length < collectionStorage.maxChunkCount)
		await browser.storage.sync.remove(getChunkKeys(chunks.length));
}

function splitIntoChunks(data: string): string[]
{
	// QUOTA_BYTES_PER_ITEM includes length of key name, length of content and 2 more bytes (for unknown reason).
	const chunkKey: string = getChunkKeys(collectionStorage.maxChunkCount - 1)[0];
	const chunkSize = (chrome.storage.sync.QUOTA_BYTES_PER_ITEM ?? 8192) - chunkKey.length - 2;
	const chunks: string[] = [];

	for (let i = 0; i < data.length; i += chunkSize)
		chunks.push(data.slice(i, i + chunkSize));

	return chunks;
}

function getStorageKey(storageItem: WxtStorageItem<any, any>): string
{
	return storageItem.key.split(":")[1];
}
