import { saveCollections } from "@/features/collectionStorage";
import { GraphicsStorage } from "@/models/CollectionModels";
import { settings } from "@/utils/settings";
import { decompress } from "lzutf8";
import { LegacyCollection, LegacyGraphics } from "../models/LegacyModels";
import migrateCollections from "./migrateCollections";

export default async function migrateStorage(): Promise<void>
{
	// Retrieve settings
	const loadOnRestore: boolean | null = await storage.getItem<boolean>("sync:loadOnRestore");
	const setAsideOnClick: boolean | null = await storage.getItem<boolean>("sync:setAsideOnClick");
	const showDeleteDialog: boolean | null = await storage.getItem<boolean>("sync:showDeleteDialog");
	const listView: boolean | null = await storage.getItem<boolean>("sync:listview");

	// Retrieve v2 collections
	const legacyCollections: LegacyCollection[] = [];
	Object.entries(await browser.storage.sync.get(null)).forEach(([key, value]) =>
	{
		if (key.startsWith("set_"))
			legacyCollections.push({
				...JSON.parse(decompress(value, { inputEncoding: "StorageBinaryString" })),
				timestamp: parseInt(key.substring(4))
			});
	});

	// Retrieve v2 graphics
	const v2Graphics: Record<string, LegacyGraphics> = await storage.getItem("local:thumbnails") ?? {};

	// Nuke everything
	await browser.storage.local.clear();
	await browser.storage.sync.clear();

	// Migrate collections & graphics
	const [collections] = migrateCollections(legacyCollections);
	const graphics: GraphicsStorage = {};

	for (const [key, record] of Object.entries(v2Graphics))
	{
		if (!graphics[key])
			graphics[key] = { icon: record.iconUrl, preview: record.pageCapture };
		else
		{
			graphics[key].icon ??= record.iconUrl;
			graphics[key].preview ??= record.pageCapture;
		}
	}

	await saveCollections(collections, true, graphics);

	// Migrate settings
	if (loadOnRestore !== null)
		settings.dismissOnLoad.setValue(!loadOnRestore);
	if (setAsideOnClick !== null)
		settings.contextAction.setValue(setAsideOnClick ? "action" : "open");
	if (showDeleteDialog !== null)
		settings.deletePrompt.setValue(showDeleteDialog);
	if (listView !== null)
		settings.tilesView.setValue(!listView);
}
