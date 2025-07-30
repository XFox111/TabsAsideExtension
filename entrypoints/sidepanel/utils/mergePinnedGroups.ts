import { CollectionItem, TabItem } from "@/models/CollectionModels";

export default function mergePinnedGroups(collection: CollectionItem): void
{
	const pinnedItems: TabItem[] = [];
	const otherItems: CollectionItem["items"] = [];
	let pinExists: boolean = false;

	collection.items.forEach(item =>
	{
		if (item.type === "group" && item.pinned === true)
		{
			pinExists = true;
			pinnedItems.push(...item.items);
		}
		else
			otherItems.push(item);
	});

	if (pinnedItems.length > 0 || pinExists)
		collection.items = [
			{ type: "group", pinned: true, items: pinnedItems },
			...otherItems
		];
	else
		collection.items = otherItems;
}
