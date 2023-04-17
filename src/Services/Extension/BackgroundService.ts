import { isFirefox } from "react-device-detect";
import { Runtime, Tabs, Storage, Menus, Action } from "webextension-polyfill";
import CollectionModel from "../../Models/Data/CollectionModel";
import IGraphics from "../../Models/Data/IGraphics";
import SettingsModel from "../../Models/Data/SettingsModel";
import { CommsMessage, SaveTabsRequestedMessage, ThumbnailAcquiredMessage } from "../../Utils/CommsMessage";
import ext, { chromiumOnlyOptions, contextMenus } from "../../Utils/ext";
import IMigration from "../Migration/IMigration";
import MigrationV1 from "../Migration/MigrationV1";
import MigrationV2 from "../Migration/MigrationV2";
import CollectionsRepository from "../Storage/CollectionsRepository";
import GraphicsRepository from "../Storage/GraphicsRepository";
import SettingsRepository from "../Storage/SettingsRepository";
import Package from "../../../package.json";
import * as TabManager from "../../Utils/TabManager";
import { SaveActions } from "../../Models/Data/SettingsTypes";

const LOG_PREFIX : string = "TabsAsideExtension.BackgroundService";

let thumbnails: Record<string, string> = {};

function Init(): void
{
	console.log(`[${LOG_PREFIX}.Init]`, "Initializing background service... ");
	console.log(`[${LOG_PREFIX}.Init]`, `Extension version: ${Package.version}`);

	if (!ext)
	{
		console.warn(`[${LOG_PREFIX}.Init]`, "Extension API is not available. Exiting...");
		return;
	}

	if (!ext.runtime.onInstalled.hasListener(OnExtensionInstalled))
		ext.runtime.onInstalled.addListener(OnExtensionInstalled);

	if (!ext.tabs.onRemoved.hasListener(OnTabRemoved))
		ext.tabs.onRemoved.addListener(OnTabRemoved);

	if (!ext.storage.onChanged.hasListener(OnStorageChanged))
		ext.storage.onChanged.addListener(OnStorageChanged);

	if (!ext.runtime.onMessage.hasListener(OnMessageReceived))
		ext.runtime.onMessage.addListener(OnMessageReceived);

	if (!ext.contextMenus.onClicked.hasListener(OnContextMenuClicked))
		ext.contextMenus.onClicked.addListener(OnContextMenuClicked);

	if (!ext.action.onClicked.hasListener(OnActionClicked))
		ext.action.onClicked.addListener(OnActionClicked);

	console.log(`[${LOG_PREFIX}.Init]`, "Background service initialized.");
}

async function OnActionClicked(_: Tabs.Tab, __: Action.OnClickData): Promise<void>
{
	let settings: SettingsModel = await new SettingsRepository().GetSettingsAsync();

	if (settings.Behavior === "popup")
		await ext.action.openPopup();
	else
	{
		if (settings.Behavior === "tab")
			await OnTabRemoved(-1, { isWindowClosing: false, windowId: -1 });	// Fallback tab reopening

		await PerformAction(settings.DefaultSaveAction);
	}
}

async function OnMessageReceived(message: CommsMessage, _: Runtime.MessageSender): Promise<void>
{
	switch (message.Command)
	{
		case CommsMessage.THUMBNAIL_ACQUIRED:
			thumbnails[ThumbnailAcquiredMessage.GetUrl(message)] = ThumbnailAcquiredMessage.GetImage(message);
			console.log(`[${LOG_PREFIX}.OnMessageReceived]`, `Received a thumbnail for URL: ${ThumbnailAcquiredMessage.GetUrl(message)}`);
			break;

		case CommsMessage.SAVE_TABS_REQUESTED:
			console.log(`[${LOG_PREFIX}.OnMessageReceived]`, `Received request for save action: ${SaveTabsRequestedMessage.GetAction(message)}`);
			await PerformAction(SaveTabsRequestedMessage.GetAction(message));
			break;

		default:
			console.warn(`[${LOG_PREFIX}.OnMessageReceived]`, "Received unknown message", message);
	}
}

async function OnStorageChanged(changes: Record<string, Storage.StorageChange>, areaName: string): Promise<void>
{
	console.log(`[${LOG_PREFIX}.OnStorageChanged]`, "Storage changed in area: " + areaName);

	let keys: string[] = Object.keys(changes);

	if (keys.some(i => i === "CollectionsCount" || i === "ShowBadgeCounter" || i === "Behavior"))
		await UpdateBadgeAsync();

	if (keys.some(i => i === "Behavior" || i === "ActionBehavior"))
		await UpdateBehavior();
}

async function UpdateBehavior(): Promise<void>
{
	let settings: SettingsModel = await new SettingsRepository().GetSettingsAsync();

	console.log(`[${LOG_PREFIX}.UpdateBehavior]`, `Updating behavior to: ${settings.Behavior} (${settings.ActionBehavior})`);

	if (settings.Behavior === "popup" || settings.ActionBehavior !== "contextmenu")
		await ext.action.enable();
	else
		await ext.action.disable();

	if (settings.Behavior === "tab")
		await OnTabRemoved(-1, { isWindowClosing: false, windowId: -1 });
	else
	{
		let tabs: Tabs.Tab[] = await ext.tabs.query({ pinned: true, url: ext.runtime.getURL("/index.html") });
		await ext.tabs.remove(tabs.map(i => i.id));
	}
}

async function OnTabRemoved(tabId: number, removeInfo: Tabs.OnRemovedRemoveInfoType): Promise<void>
{
	console.log(`[${LOG_PREFIX}.OnTabRemoved]`, tabId, removeInfo);

	if (removeInfo.isWindowClosing)
		return;

	let settings: SettingsModel = await new SettingsRepository().GetSettingsAsync();

	if (settings.Behavior === "tab")
	{
		let tabs: Tabs.Tab[] = await ext.tabs.query({ pinned: true, url: ext.runtime.getURL("/index.html") });

		if (tabs.length > 0)
			return;

		console.warn(`[${LOG_PREFIX}.OnTabRemoved]`, "Extension tab was closed. Repoenning...");

		try { await ext.tabs.create({ url: ext.runtime.getURL("/index.html"), pinned: true, active: false, index: 0 }); }
		catch { }
	}
}

async function OnExtensionInstalled(details: Runtime.OnInstalledDetailsType): Promise<void>
{
	console.log(`[${LOG_PREFIX}.OnExtensionUpdated]`, `Reason: ${details.reason}`);

	if (details.reason === "update")
	{
		let previousMajor: number = parseInt(details.previousVersion.split(".")[0]);

		console.log(`[${LOG_PREFIX}.OnExtensionUpdated]`, `Upgraded from version: ${details.previousVersion}`);

		if (previousMajor < 3)
			await ApplyMigrationAsync(previousMajor);
	}

	await CreateContextMenusAsync();
	await UpdateBadgeAsync();
}

async function UpdateBadgeAsync(): Promise<void>
{
	console.log(`[${LOG_PREFIX}.UpdateBadgeAsync]`, "Updating badge...");

	let settings: SettingsModel = await new SettingsRepository().GetSettingsAsync();

	if (!settings.ShowBadgeCounter || settings.Behavior === "tab")
	{
		await ext.action.setBadgeText({ text: "" });
		return;
	}

	let count: number = await new CollectionsRepository().GetCountAsync();

	console.log(`[${LOG_PREFIX}.UpdateBadgeAsync]`, "Updating badge with count: " + count);

	await ext.action.setBadgeText({ text: count > 0 ? count.toString() : "" });
}

async function CreateContextMenusAsync(): Promise<void>
{
	console.log(`[${LOG_PREFIX}.CreateContextMenusAsync]`, "Creating context menus...");
	await ext.contextMenus.removeAll();

	for (let item of contextMenus)
		ext.contextMenus.create(item);

	if (isFirefox)
		for (let id of chromiumOnlyOptions)
			await ext.contextMenus.remove(id);
}

async function ApplyMigrationAsync(previousMajor: number): Promise<void>
{
	console.log(`[${LOG_PREFIX}.ApplyMigrationAsync]`, "Applying migration from version: " + previousMajor);

	let migration: IMigration = previousMajor === 2 ? new MigrationV2() : new MigrationV1();

	let collections: CollectionModel[] = await migration.RecoverCollectionsAsync();
	console.log(`[${LOG_PREFIX}.ApplyMigrationAsync]`, "Recovered collections: " + collections.length, collections);

	let settings: SettingsModel = await migration.RecoverSettingsAsync();
	console.log(`[${LOG_PREFIX}.ApplyMigrationAsync]`, "Recovered settings", settings);

	let graphics: Record<string, IGraphics> = await migration.RecoverGraphicsAsync();
	console.log(`[${LOG_PREFIX}.ApplyMigrationAsync]`, "Recovered graphics: " + Object.keys(graphics).length, graphics);

	console.log(`[${LOG_PREFIX}.ApplyMigrationAsync]`, "Cleaning up storage...");

	localStorage.clear();
	await ext.storage.local.clear();
	await ext.storage.sync.clear();

	console.log(`[${LOG_PREFIX}.ApplyMigrationAsync]`, "Saving recovered data...");

	if (settings)
	{
		let settingsRepo: SettingsRepository = new SettingsRepository();
		await settingsRepo.UpdateSettingsAsync(settings);
	}

	if (collections)
	{
		let collectionsRepo: CollectionsRepository = new CollectionsRepository();
		await collectionsRepo.AddAsync(...collections);
	}

	if (graphics)
	{
		let graphicsRepo: GraphicsRepository = new GraphicsRepository();
		await graphicsRepo.AddOrUpdateGraphicsAsync(graphics);
	}

	console.log(`[${LOG_PREFIX}.ApplyMigrationAsync]`, "Migration completed.");
}

async function OnContextMenuClicked(info: Menus.OnClickData, _: Tabs.Tab): Promise<void>
{
	await PerformAction(info.menuItemId as SaveActions);
}

async function PerformAction(action: SaveActions): Promise<void>
{
	switch(action)
	{
		case SaveActions.SaveTabsAll:
			await TabManager.SaveTabsAsync("all", thumbnails);
			return;
		case SaveActions.SaveTabsSelected:
			await TabManager.SaveTabsAsync("selected", thumbnails);
			return;
		case SaveActions.SaveTabsGroup:
			await TabManager.SaveGroupAsync(thumbnails);
			return;

		default:
			break;
	}

	let ids: number[];
	let tabsCount: number = (await ext.tabs.query({ currentWindow: true })).length;

	switch(action)
	{
		case SaveActions.SetAsideAll:
			ids = await TabManager.SaveTabsAsync("all", thumbnails);
			break;
		case SaveActions.SetAsideSelected:
			ids = await TabManager.SaveTabsAsync("selected", thumbnails);
			break;
		case SaveActions.SetAsideGroup:
			ids = await TabManager.SaveGroupAsync(thumbnails);
			break;

		default:
			break;
	}

	console.log("Tabs to close", ids.length, ids);
	console.log("Active tabs", tabsCount);

	if (ids.length >= tabsCount)
	{
		await ext.tabs.create({ });
		await new Promise(res => setTimeout(res, 100));	// To make sure that new tab has been opened
	}

	await ext.tabs.remove(ids);
}

Init();
