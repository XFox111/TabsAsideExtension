import { CollectionItem, GroupItem } from "@/models/CollectionModels";
import { Tabs } from "wxt/browser";

export async function createCollectionFromTabs(tabs: Tabs.Tab[]): Promise<CollectionItem>
{
	const collection: CollectionItem = {
		type: "collection",
		timestamp: Date.now(),
		items: []
	};

	if (tabs.length < 1)
		return collection;

	let tabIndex: number = 0;

	if (tabs[tabIndex].pinned)
	{
		collection.items.push({ type: "group", pinned: true, items: [] });

		for (; tabIndex < tabs.length; tabIndex++)
		{
			if (!tabs[tabIndex].pinned)
				break;

			(collection.items[0] as GroupItem).items.push({
				type: "tab",
				url: tabs[tabIndex].url!,
				title: tabs[tabIndex].title
			});
		}
	}

	// Special case, if all tabs are in the same group, create a collection with the group title
	if (tabs[0].groupId && tabs[0].groupId !== -1 &&
		tabs.every(i => i.groupId === tabs[0].groupId)
	)
	{
		const group = await chrome.tabGroups.get(tabs[0].groupId);
		collection.title = group.title;
		collection.color = group.color;

		tabs.forEach(i =>
			collection.items.push({ type: "tab", url: i.url!, title: i.title })
		);

		return collection;
	}

	let activeGroup: number | null = null;

	for (; tabIndex < tabs.length; tabIndex++)
	{
		const tab = tabs[tabIndex];

		if (!tab.groupId || tab.groupId === -1)
		{
			collection.items.push({ type: "tab", url: tab.url!, title: tab.title });
			activeGroup = null;
			continue;
		}

		if (!activeGroup || activeGroup !== tab.groupId)
		{
			activeGroup = tab.groupId;
			const group = await chrome.tabGroups.get(activeGroup);

			collection.items.push({
				type: "group",
				color: group.color,
				title: group.title,
				items: []
			});
		}

		(collection.items[collection.items.length - 1] as GroupItem).items.push({
			type: "tab",
			url: tab.url!,
			title: tab.title
		});
	}

	return collection;
}
