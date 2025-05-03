import { CollectionItem, GroupItem, TabItem } from "@/models/CollectionModels";

export default function parseCollections(data: string): CollectionItem[]
{
	if (!data)
		return [];

	const collections: CollectionItem[] = [];
	const lines: string[] = data.split("\n");

	for (const line of lines)
	{
		if (line.startsWith("c"))
		{
			const collection: CollectionItem = parseCollection(line);
			collections.push(collection);
		}
		else if (line.startsWith("\tg"))
		{
			const group: GroupItem = parseGroup(line);
			collections[collections.length - 1].items.push(group);
		}
		else if (line.startsWith("\t\tt"))
		{
			const tab: TabItem = parseTab(line);

			const collectionIndex: number = collections.length - 1;
			const groupIndex: number = collections[collectionIndex].items.length - 1;

			(collections[collectionIndex].items[groupIndex] as GroupItem).items.push(tab);
		}
		else if (line.startsWith("\tt"))
		{
			const tab: TabItem = parseTab(line);
			collections[collections.length - 1].items.push(tab);
		}
	}

	return collections;
}

function parseCollection(data: string): CollectionItem
{
	return {
		type: "collection",
		timestamp: parseInt(data.match(/(?<=^c)\d+/)!.toString()),
		color: data.match(/(?<=^c\d+\/)[a-z]+/)?.toString() as chrome.tabGroups.ColorEnum,
		title: data.match(/(?<=^c[\da-z/]*\|).*/)?.toString(),
		items: []
	};
}

function parseGroup(data: string): GroupItem
{
	const isPinned: boolean = data.match(/^\tg\/p$/) !== null;

	if (isPinned)
		return {
			type: "group",
			pinned: true,
			items: []
		};

	return {
		type: "group",
		pinned: false,
		color: data.match(/(?<=^\tg\/)[a-z]+/)?.toString() as chrome.tabGroups.ColorEnum,
		title: data.match(/(?<=^\tg\/[a-z]+\|).*$/)?.toString(),
		items: []
	};
}

function parseTab(data: string): TabItem
{
	return {
		type: "tab",
		url: data.match(/(?<=^(\t){1,2}t\|).*(?=\|)/)!.toString(),
		title: data.match(/(?<=^(\t){1,2}t\|.*\|).*$/)?.toString()
	};
}
