import { track } from "@/features/analytics";
import { CollectionItem, GroupItem } from "@/models/CollectionModels";
import { Tabs } from "wxt/browser";
import sendNotification from "./sendNotification";
import { settings } from "./settings";

export default async function saveTabsToCollection(closeTabs: boolean): Promise<CollectionItem>
{
	let tabs: Tabs.Tab[] = await browser.tabs.query({
		currentWindow: true,
		highlighted: true
	});

	if (tabs.length < 2)
	{
		const ignorePinned: boolean = await settings.ignorePinned.getValue();
		tabs = await browser.tabs.query({
			currentWindow: true,
			pinned: ignorePinned ? false : undefined
		});
	}

	const [collection, tabsToClose] = await createCollectionFromTabs(tabs);

	if (closeTabs)
	{
		await browser.tabs.create({
			active: true,
			windowId: tabs[0].windowId
		});
		await browser.tabs.remove(tabsToClose.map(i => i.id!));
	}

	track(closeTabs ? "set_aside" : "save");

	return collection;
}

async function createCollectionFromTabs(tabs: Tabs.Tab[]): Promise<[CollectionItem, Tabs.Tab[]]>
{
	if (tabs.length < 1)
		return [{ type: "collection", timestamp: Date.now(), items: [] }, []];

	const tabCount: number = tabs.length;

	tabs = tabs.filter(i =>
		i.url
		&& new URL(i.url).protocol !== "about:"
		&& new URL(i.url).hostname !== "newtab"
	);

	if (tabs.length < tabCount)
		await sendNotification({
			title: i18n.t("notifications.partial_save.title"),
			message: i18n.t("notifications.partial_save.message"),
			icon: "/notification_icons/save_warning.png"
		});

	tabs = tabs.filter(i => !i.url!.startsWith(browser.runtime.getURL("/")));

	const collection: CollectionItem = {
		type: "collection",
		timestamp: Date.now(),
		items: []
	};

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

		return [collection, tabs];
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

	return [collection, tabs];
}
