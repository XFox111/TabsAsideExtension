import { getCollections } from "@/features/collectionStorage";
import saveCollections from "@/features/collectionStorage/utils/saveCollections";
import { LegacyCollection } from "../models/LegacyModels";
import migrateCollections from "./migrateCollections";

export default async function migrateLocalStorage(): Promise<void>
{
	// Retrieve v1 collections
	const legacyCollections: LegacyCollection[] = JSON.parse(globalThis.localStorage?.getItem("sets") || "[]");

	// Nuke localStorage
	globalThis.localStorage?.clear();

	// Migrate collections
	const [resultCollections, resultGraphics] = migrateCollections(legacyCollections);
	const [collections] = await getCollections();
	await saveCollections([...collections, ...resultCollections], true, resultGraphics);
}
