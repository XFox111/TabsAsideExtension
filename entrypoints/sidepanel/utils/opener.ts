import { getCollectionTitle } from "@/entrypoints/sidepanel/utils/getCollectionTitle";
import { CollectionItem, GroupItem, TabItem } from "@/models/CollectionModels";
import { settings } from "@/utils/settings";
import { Tabs, Windows } from "wxt/browser";

export async function openCollection(collection: CollectionItem, targetWindow?: "current" | "new" | "incognito"): Promise<void>
{
	if (targetWindow === "incognito" && !(await browser.extension.isAllowedIncognitoAccess()))
		throw new Error("The extension doesn't have incognito permission");

	const discard: boolean = await settings.dismissOnLoad.getValue();

	await manageWindow(
		async windowId =>
		{
			if (collection.items.some(i => i.type === "group"))
				// Open tabs as regular, open groups as groups
				await Promise.all(collection.items.map(async i =>
				{
					if (i.type === "tab")
						await createTab(i.url, windowId, discard);
					else
						await createGroup(i, windowId, discard);
				}));

			else if (collection.color)
				// Open collection as one big group
				await createGroup({
					type: "group",
					color: collection.color,
					title: getCollectionTitle(collection),
					items: collection.items as TabItem[]
				}, windowId);

			else
				// Open collection tabs as is
				await Promise.all(collection.items.map(async i =>
					await createTab((i as TabItem).url, windowId, discard)
				));
		},
		(!targetWindow || targetWindow === "current") ?
			undefined :
			{ incognito: targetWindow === "incognito" }
	);
}

export async function openGroup(group: GroupItem, newWindow: boolean = false): Promise<void>
{
	await manageWindow(
		windowId => createGroup(group, windowId),
		newWindow ? {} : undefined
	);
}

async function createGroup(group: GroupItem, windowId: number, discard?: boolean): Promise<void>
{
	discard ??= await settings.dismissOnLoad.getValue();
	const tabs: Tabs.Tab[] = await Promise.all(group.items.map(async i =>
		await createTab(i.url, windowId, discard, group.pinned)
	));

	// "Pinned" group is technically not a group, so not much else to do here
	if (group.pinned === true)
		return;

	const groupId: number = await chrome.tabs.group({
		tabIds: tabs.filter(i => i.windowId === windowId).map(i => i.id!),
		createProperties: { windowId }
	});

	// Grouping support came in 138, tabGroups is expected to be in 139
	// TODO: Remove this check once the API is available
	if (!import.meta.env.FIREFOX)
		await chrome.tabGroups.update(groupId, {
			title: group.title,
			color: group.color
		});
}

async function manageWindow(handle: (windowId: number) => Promise<void>, windowProps?: Windows.CreateCreateDataType): Promise<void>
{
	const currentWindow: Windows.Window = windowProps ?
		await browser.windows.create({ url: "about:blank", focused: false, ...windowProps }) :
		await browser.windows.getCurrent();
	const windowId: number = currentWindow.id!;

	await handle(windowId);

	await browser.windows.update(windowId, { focused: true });

	if (windowProps)
		// Close "about:blank" tab
		await browser.tabs.remove(currentWindow.tabs![0].id!);
}

async function createTab(url: string, windowId: number, discard: boolean, pinned?: boolean): Promise<Tabs.Tab>
{
	const tab = await browser.tabs.create({ url, windowId: windowId, active: false, pinned });

	if (discard)
		discardOnLoad(tab.id!);

	return tab;
}

function discardOnLoad(tabId: number): void
{
	const handleTabUpdated = (id: number, _: any, tab: Tabs.Tab) =>
	{
		if (id !== tabId || !tab.url)
			return;

		browser.tabs.onUpdated.removeListener(handleTabUpdated);

		if (!tab.active)
			browser.tabs.discard(tabId);
	};

	browser.tabs.onUpdated.addListener(handleTabUpdated);
}
