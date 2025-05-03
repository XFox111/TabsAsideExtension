import { CollectionItem } from "@/models/CollectionModels";
import { decompress } from "lzutf8";
import { collectionStorage } from "./collectionStorage";
import getChunkKeys from "./getChunkKeys";
import parseCollections from "./parseCollections";

export default async function getCollectionsFromCloud(): Promise<CollectionItem[]>
{
	const chunkCount: number = await collectionStorage.chunkCount.getValue();

	if (chunkCount < 1)
		return [];

	const chunks: Record<string, string> =
		await browser.storage.sync.get(getChunkKeys(0, chunkCount)) as Record<string, string>;

	const data: string = decompress(Object.values(chunks).join(), { inputEncoding: "StorageBinaryString" });

	return parseCollections(data);
}
