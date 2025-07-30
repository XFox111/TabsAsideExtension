import { CollectionItem, GroupItem, TabItem } from "@/models/CollectionModels";

export default function serializeCollections(collections: CollectionItem[]): string
{
	let data: string = "";

	for (const collection of collections)
	{
		data += getCollectionString(collection);

		for (const item of collection.items)
		{
			if (item.type === "group")
			{
				data += getGroupString(item);

				for (const tab of item.items)
					data += `\t${getTabString(tab)}`;
			}
			else if (item.type === "tab")
				data += getTabString(item);
		}
	}

	return data;
}

function getCollectionString(collection: CollectionItem): string
{
	let data: string = `c${collection.timestamp}`;

	if (collection.color)
		data += `/${collection.color}`;

	if (collection.title)
		data += `|${collection.title}`;

	data += "\n";

	return data;
}

function getGroupString(group: GroupItem): string
{
	let data: string = "\tg";

	if (group.pinned === true)
		data += "/p";
	else
	{
		data += `/${group.color}`;

		if (group.title)
			data += `|${group.title}`;
	}

	data += "\n";

	return data;
}

function getTabString(tab: TabItem): string
{
	let data: string = "\tt";

	data += `|${tab.url}|`;

	if (tab.title)
		data += tab.title;

	data += "\n";

	return data;
}
