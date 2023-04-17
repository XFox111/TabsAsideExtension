import { isFirefox } from "react-device-detect";
import { Tabs } from "webextension-polyfill";
import CollectionModel from "../Models/Data/CollectionModel";
import GroupModel from "../Models/Data/GroupModel";
import IGraphics from "../Models/Data/IGraphics";
import SettingsModel from "../Models/Data/SettingsModel";
import { GroupingPolicy } from "../Models/Data/SettingsTypes";
import TabModel from "../Models/Data/TabModel";
import CollectionsRepository from "../Services/Storage/CollectionsRepository";
import GraphicsRepository from "../Services/Storage/GraphicsRepository";
import SettingsRepository from "../Services/Storage/SettingsRepository";
import ext from "./ext";

export async function SaveTabsAsync(selection: "all" | "selected", thumnailsCache: Record<string, string>): Promise<number[]>
{
	let settings: SettingsModel = await new SettingsRepository().GetSettingsAsync();

	let query: Tabs.QueryQueryInfoType | chrome.tabs.QueryInfo =
	{
		currentWindow: true,
		highlighted: selection === "selected" ? true : undefined,
		pinned: selection === "selected" || !settings.IncludePinned ? undefined : false
	};

	let tabs: Tabs.Tab[] | chrome.tabs.Tab[] = isFirefox ? await ext.tabs.query(query) : await chrome.tabs.query(query);
	tabs = (tabs as Tabs.Tab[]).filter(i => TabFilter(i));

	if (tabs.length < 1)
	{
		alert("There's no tabs available to save");
		return [];
	}

	let data = isFirefox ?
		await BuildCollectionsTree(tabs as Tabs.Tab[], thumnailsCache) :
		await BuildCollectionsTree(tabs as chrome.tabs.Tab[], thumnailsCache, settings.GroupingPolicy);

	new CollectionsRepository().AddAsync(...data.Collections);
	new GraphicsRepository().AddOrUpdateGraphicsAsync(data.Graphics);

	return tabs.map(i => i.id);
}

export async function SaveGroupAsync(thumbnailsCache: Record<string, string>): Promise<number[]>
{
	if (isFirefox)
		throw new Error("This feature is not supported on Firefox");

	let settings: SettingsModel = await new SettingsRepository().GetSettingsAsync();

	let groupId: number = (await chrome.tabs.query({ active: true, currentWindow: true }))[0].groupId;

	let collection: CollectionModel;
	let tabs: chrome.tabs.Tab[];
	let graphics: Record<string, IGraphics> = {};

	if (groupId === chrome.tabGroups.TAB_GROUP_ID_NONE)
	{
		collection = new CollectionModel();
		tabs = await chrome.tabs.query({ currentWindow: true, groupId, pinned: settings.IncludePinned ? undefined : false });
	}
	else
	{
		let group: chrome.tabGroups.TabGroup = await chrome.tabGroups.get(groupId);
		collection = new CollectionModel(group.title, group.color);
		tabs = await chrome.tabs.query({ currentWindow: true, groupId });
	}

	tabs = tabs.filter(i => TabFilter(i));

	if (tabs.length < 1)
	{
		alert("There's no tabs available to save");
		return [];
	}

	for (let tab of tabs)
	{
		let tabItem: TabModel = new TabModel(tab.url ?? tab.pendingUrl, tab.title);
		collection.Items.push(tabItem);
		graphics[tabItem.Url] = { Icon: tab.favIconUrl, Thumbnail: thumbnailsCache[tabItem.Url] };
	}

	new CollectionsRepository().AddAsync(collection);

	return tabs.map(i => i.id);
}

async function BuildCollectionsTree(tabs: Tabs.Tab[], thumbnailsRepo: Record<string, string>): Promise<{ Collections: CollectionModel[], Graphics: Record<string, IGraphics> }>;
async function BuildCollectionsTree(tabs: chrome.tabs.Tab[], thumbnailsRepo: Record<string, string>, groupingPolicy: GroupingPolicy): Promise<{ Collections: CollectionModel[], Graphics: Record<string, IGraphics> }>;
async function BuildCollectionsTree(tabs: any[], thumbnailsRepo: Record<string, string>, groupingPolicy?: GroupingPolicy): Promise<{ Collections: CollectionModel[], Graphics: Record<string, IGraphics> }>
{
	let data: { Collections: CollectionModel[], Graphics: Record<string, IGraphics> } =
	{
		Collections: [],
		Graphics: { }
	};

	if (!groupingPolicy || groupingPolicy === "omit")
	{
		let collection: CollectionModel = new CollectionModel();

		for (let tab of tabs as Tabs.Tab[])
		{
			let tabItem: TabModel = new TabModel(tab.url ?? tab.pendingUrl, tab.title);

			collection.Items.push(tabItem);
			data.Graphics[tabItem.Url] = { Icon: tab.favIconUrl, Thumbnail: thumbnailsRepo[tabItem.Url] };
		}

		data.Collections.push(collection);
		return data;
	}

	let groups: ITabGroup[] = (tabs as chrome.tabs.Tab[]).reduce((acc: ITabGroup[], tab: chrome.tabs.Tab) =>
	{
		let groupId: number = tab.pinned ? -2 : (tab.groupId ?? chrome.tabGroups.TAB_GROUP_ID_NONE);

		if (acc.length < 1)
		{
			acc.push({ groupId, tabs: [tab] });
			return acc;
		}

		if (acc[acc.length - 1].groupId === groupId)
			acc[acc.length - 1].tabs.push(tab);
		else
			acc.push({ groupId, tabs: [tab] });

		return acc;
	}, []);

	if (groupingPolicy === "separate")
	{
		// Creating collection for pinned items
		let pinned: ITabGroup = groups.find(i => i.groupId === -2);

		if (pinned)
		{
			let collection: CollectionModel = new CollectionModel("Pinned", "grey");

			for (let tab of pinned.tabs)
			{
				let tabItem: TabModel = new TabModel(tab.url ?? tab.pendingUrl, tab.title);

				collection.Items.push(tabItem);
				data.Graphics[tabItem.Url] = { Icon: tab.favIconUrl, Thumbnail: thumbnailsRepo[tabItem.Url] };
			}

			data.Collections.push(collection);
		}

		// Creating collection for ungrouped tabs
		let ungrouped: ITabGroup = groups.find(i => i.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE);

		if (ungrouped)
		{
			let collection: CollectionModel = new CollectionModel();

			for (let tab of ungrouped.tabs)
			{
				let tabItem: TabModel = new TabModel(tab.url ?? tab.pendingUrl, tab.title);

				collection.Items.push(tabItem);
				data.Graphics[tabItem.Url] = { Icon: tab.favIconUrl, Thumbnail: thumbnailsRepo[tabItem.Url] };
			}

			data.Collections.push(collection);
		}

		// Creating collections for grouped items
		for (let group of groups.filter(i => i.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE && i.groupId !== -2))
		{
			let tabGroup: chrome.tabGroups.TabGroup = await chrome.tabGroups.get(group.groupId);

			let collection: CollectionModel = new CollectionModel(tabGroup.title, tabGroup.color);

			for (let tab of group.tabs)
			{
				let tabItem: TabModel = new TabModel(tab.url ?? tab.pendingUrl, tab.title);

				collection.Items.push(tabItem);
				data.Graphics[tabItem.Url] = { Icon: tab.favIconUrl, Thumbnail: thumbnailsRepo[tabItem.Url] };
			}

			data.Collections.push(collection);
		}
	}
	else if (groupingPolicy === "preserve")
	{
		let collection: CollectionModel = new CollectionModel();

		for (let group of groups)
		{
			if (group.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE)		// If it's ungrouped tabs
			{
				// Just place them directly into collection
				for (let tab of group.tabs)
				{
					let tabItem: TabModel = new TabModel(tab.url ?? tab.pendingUrl, tab.title);

					collection.Items.push(tabItem);
					data.Graphics[tabItem.Url] = { Icon: tab.favIconUrl, Thumbnail: thumbnailsRepo[tabItem.Url] };
				}

				continue;
			}

			let groupItem: GroupModel;

			if (group.groupId === -2)	// If it's a group of pinned tabs
				groupItem = new GroupModel();
			else
			{
				let tabGroup: chrome.tabGroups.TabGroup = await chrome.tabGroups.get(group.groupId);
				groupItem = new GroupModel(tabGroup.color, tabGroup.title, tabGroup.collapsed);
			}

			for (let tab of group.tabs)
			{
				let tabItem: TabModel = new TabModel(tab.url ?? tab.pendingUrl, tab.title);

				groupItem.Tabs.push(tabItem);
				data.Graphics[tabItem.Url] = { Icon: tab.favIconUrl, Thumbnail: thumbnailsRepo[tabItem.Url] };
			}

			collection.Items.push(groupItem);
		}

		data.Collections.push(collection);
	}

	return data;
}

interface ITabGroup
{
	groupId: number;
	tabs: chrome.tabs.Tab[];
}

function TabFilter(tab: Tabs.Tab | chrome.tabs.Tab): boolean
{
	let url = (tab.url ?? tab.pendingUrl)?.toLocaleLowerCase();

	if (!url)
		return false;

	if (url.startsWith(ext.runtime.getURL("").toLocaleLowerCase()))
		return false;

	// TODO: Add more exclusion rules
	// - For new tabs

	return true;
}
