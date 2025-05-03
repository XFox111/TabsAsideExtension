import { collectionStorage } from "./collectionStorage";

export default function getChunkKeys(start: number = 0, end: number = collectionStorage.maxChunkCount): string[]
{
	return Array.from({ length: end - start }, (_, i) => "c" + (i + start));
}
