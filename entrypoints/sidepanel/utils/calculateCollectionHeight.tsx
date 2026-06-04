import { CollectionItem, GroupItem } from "@/models/CollectionModels";

export default function calculateCollectionHeight(collection: CollectionItem, tilesView: boolean, compactView: boolean): number
{
	if (compactView)
		return collection.color ? 69.2 : 67.6;

	if (collection.items.length < 1)
		return collection.color ? 217.6 : 219.2;

	if (tilesView)
	{
		let height = 201.6;

		if (collection.items.some(i => i.type === "group"))
			height = 242.4;

		if (collection.color)
			height += 1.6;

		return height;
	}

	else
	{
		let baseHeight: number = collection.color ? 81.2 : 79.6;

		baseHeight += 39.6 * collection.items.flatMap(i => i.type === "group" ? i.items : [i]).length - 6;

		const groups: GroupItem[] = collection.items.filter(i => i.type === "group");

		for (const group of groups)
			baseHeight += group.items.length < 1 ? 126 : 50;

		return Math.min(baseHeight, 572);
	}
}
