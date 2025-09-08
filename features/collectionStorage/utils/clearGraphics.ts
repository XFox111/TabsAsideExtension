import { collectionStorage } from "./collectionStorage";

export default async function clearGraphicsStorage(): Promise<void>
{
	await collectionStorage.graphics.removeValue();
}
