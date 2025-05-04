import { CollectionItem, GraphicsItem, GraphicsStorage } from "@/models/CollectionModels";
import { sendMessage } from "@/utils/messaging";
import { collectionStorage } from "./collectionStorage";

export default async function updateGraphics(
	collections: CollectionItem[],
	graphicsCache?: GraphicsStorage
): Promise<void>
{
	const localGraphics: GraphicsStorage = await collectionStorage.graphics.getValue();
	const tempGraphics: GraphicsStorage = graphicsCache || await sendMessage("getGraphicsCache", undefined);

	function getGraphics(url: string): GraphicsItem | null
	{
		const preview = tempGraphics[url]?.preview ?? localGraphics[url]?.preview;
		const capture = tempGraphics[url]?.capture ?? localGraphics[url]?.capture;
		const icon = tempGraphics[url]?.icon ?? localGraphics[url]?.icon;

		const graphics: GraphicsItem = {};

		if (preview)
			graphics.preview = preview;
		if (icon)
			graphics.icon = icon;
		if (capture)
			graphics.capture = capture;

		return preview || icon ? graphics : null;
	}

	const newGraphics: GraphicsStorage = {};

	for (const collection of collections)
		for (const item of collection.items)
		{
			if (item.type === "group")
				for (const tab of item.items)
				{
					const graphics = getGraphics(tab.url);

					if (graphics)
						newGraphics[tab.url] = graphics;
				}
			else
			{
				const graphics = getGraphics(item.url);

				if (graphics)
					newGraphics[item.url] = graphics;
			}
		}

	await collectionStorage.graphics.setValue(newGraphics);
}
