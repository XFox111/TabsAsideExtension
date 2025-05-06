import { track, trackError } from "@/features/analytics";
import { collectionCount, getCollections, saveCollections } from "@/features/collectionStorage";
import { migrateStorage } from "@/features/migration";
import { showWelcomeDialog } from "@/features/v3welcome/utils/showWelcomeDialog";
import { SettingsValue } from "@/hooks/useSettings";
import { CollectionItem, GraphicsStorage } from "@/models/CollectionModels";
import getLogger from "@/utils/getLogger";
import { onMessage, sendMessage } from "@/utils/messaging";
import saveTabsToCollection from "@/utils/saveTabsToCollection";
import sendNotification from "@/utils/sendNotification";
import { settings } from "@/utils/settings";
import watchTabSelection from "@/utils/watchTabSelection";
import { Tabs, Windows } from "wxt/browser";
import { Unwatch } from "wxt/storage";

export default defineBackground(() =>
{
	try
	{
		const logger = getLogger("background");
		const graphicsCache: GraphicsStorage = {};
		let listLocation: SettingsValue<"listLocation"> = "sidebar";

		logger("Background script started");

		// Little workaround for opening side panel
		// See: https://stackoverflow.com/questions/77213045/error-sidepanel-open-may-only-be-called-in-response-to-a-user-gesture-re
		settings.listLocation.getValue().then(location => listLocation = location);
		settings.listLocation.watch(newLocation => listLocation = newLocation);

		browser.runtime.onInstalled.addListener(async ({ reason, previousVersion }) =>
		{
			logger("onInstalled", reason, previousVersion);
			track("extension_installed", { reason, previousVersion: previousVersion ?? "none" });

			const previousMajor: number = previousVersion ? parseInt(previousVersion.split(".")[0]) : 0;

			if (reason === "update" && previousMajor < 3)
			{
				await migrateStorage();
				await showWelcomeDialog.setValue(true);
				browser.runtime.reload();
			}
		});

		browser.tabs.onUpdated.addListener((_, __, tab) =>
		{
			if (!tab.url)
				return;

			graphicsCache[tab.url] = {
				preview: graphicsCache[tab.url]?.preview,
				capture: graphicsCache[tab.url]?.capture,
				icon: tab.favIconUrl ?? graphicsCache[tab.url]?.icon
			};
		});

		browser.commands.onCommand.addListener(
			(command, tab) => performContextAction(command, tab!.windowId!)
		);

		onMessage("getGraphicsCache", () => graphicsCache);
		onMessage("addThumbnail", ({ data }) =>
		{
			graphicsCache[data.url] = {
				preview: data.thumbnail,
				capture: graphicsCache[data.url]?.capture,
				icon: graphicsCache[data.url]?.icon
			};
		});

		setupTabCaputre();
		async function setupTabCaputre(): Promise<void>
		{
			const tryCaptureTab = async (tab: Tabs.Tab): Promise<void> =>
			{
				if (!tab.url || tab.status !== "complete" || !tab.active)
					return;

				try
				{
					// We use chrome here because polyfill throws uncatchable errors for some reason
					// It's a compatible API anyway
					const capture: string = await chrome.tabs.captureVisibleTab(tab.windowId!, { format: "jpeg", quality: 1 });

					if (capture)
					{
						graphicsCache[tab.url] = {
							capture,
							preview: graphicsCache[tab.url]?.preview,
							icon: graphicsCache[tab.url]?.icon
						};
					}
				}
				catch { }
			};

			setInterval(() =>
			{
				browser.tabs.query({ active: true })
					.then(tabs => tabs.forEach(tab => tryCaptureTab(tab)));
			}, 1000);
		}

		setupContextMenu();
		async function setupContextMenu(): Promise<void>
		{
			await browser.contextMenus.removeAll();

			const items: Record<string, string> =
			{
				"show_collections": i18n.t("actions.show_collections"),
				"set_aside": i18n.t("actions.set_aside.all"),
				"save": i18n.t("actions.save.all")
			};

			Object.entries(items).forEach(([id, title]) => browser.contextMenus.create({
				id, title,
				visible: true,
				contexts: ["action"]
			}));

			watchTabSelection(async selection =>
			{
				await browser.contextMenus.update("set_aside", {
					title: i18n.t(`actions.set_aside.${selection}`)
				});
				await browser.contextMenus.update("save", {
					title: i18n.t(`actions.save.${selection}`)
				});
			});

			browser.contextMenus.onClicked.addListener(
				({ menuItemId }, tab) => performContextAction((menuItemId as string), tab!.windowId!)
			);
		}

		setupBadge();
		async function setupBadge(): Promise<void>
		{
			let unwatchBadge: Unwatch | null = null;
			const updateBadge = async (count: number | null) =>
				await browser.action.setBadgeText({ text: count && count > 0 ? count.toString() : "" });

			if (await settings.showBadge.getValue())
			{
				updateBadge(await collectionCount.getValue());
				unwatchBadge = collectionCount.watch(updateBadge);
			}

			if (import.meta.env.FIREFOX)
			{
				await browser.action.setBadgeBackgroundColor({ color: "#0f6cbd" });
				await browser.action.setBadgeTextColor({ color: "white" });
			}

			settings.showBadge.watch(async showBadge =>
			{
				if (showBadge)
				{
					updateBadge(await collectionCount.getValue());
					unwatchBadge = collectionCount.watch(updateBadge);
				}
				else
				{
					unwatchBadge?.();
					await browser.action.setBadgeText({ text: "" });
				}
			});
		}

		setupActionButton();
		async function setupActionButton(): Promise<void>
		{
			let unwatchActionTitle: Unwatch | null = null;

			const onClickAction = async (): Promise<void> =>
			{
				logger("action.onClicked");
				const defaultAction = await settings.defaultSaveAction.getValue();
				await saveTabs(defaultAction === "set_aside");
			};

			const updateTitle = async (selection: "all" | "selected"): Promise<void> =>
			{
				const defaultAction = await settings.defaultSaveAction.getValue();
				await browser.action.setTitle({ title: i18n.t(`actions.${defaultAction}.${selection}`) });
			};

			const toggleSidebarFirefox = async (): Promise<void> =>
				await browser.sidebarAction.toggle();

			const updateButton = async (action: SettingsValue<"contextAction">): Promise<void> =>
			{
				logger("updateButton", action);

				// Cleanup any existing behavior
				browser.action.onClicked.removeListener(onClickAction);
				browser.action.onClicked.removeListener(toggleSidebarFirefox);
				browser.action.onClicked.removeListener(openCollectionsInTab);

				await browser.action.disable();
				await browser.action.setTitle({ title: i18n.t("manifest.name") });
				unwatchActionTitle?.();

				if (!import.meta.env.FIREFOX)
					await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });

				// Setup new behavior
				if (action === "action")
				{
					browser.action.onClicked.addListener(onClickAction);
					unwatchActionTitle = watchTabSelection(updateTitle);
					await browser.action.enable();
				}
				else if (action === "open")
				{
					await browser.action.enable();
					const location = await settings.listLocation.getValue();

					if (location === "sidebar")
					{
						if (import.meta.env.FIREFOX)
							browser.action.onClicked.addListener(toggleSidebarFirefox);
						else
							chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
					}
					else if (location !== "popup")
						browser.action.onClicked.addListener(openCollectionsInTab);
				}
			};

			updateButton(await settings.contextAction.getValue());
			settings.contextAction.watch(updateButton);
			settings.listLocation.watch(async () => updateButton(await settings.contextAction.getValue()));
		}

		setupCollectionView();
		async function setupCollectionView(): Promise<void>
		{
			const enforcePinnedTab = async (): Promise<void> =>
			{
				logger("enforcePinnedTab");

				const openWindows: Windows.Window[] = await browser.windows.getAll({ populate: true });

				for (const openWindow of openWindows)
				{
					if (openWindow.incognito)
						continue;

					const activeTabs: Tabs.Tab[] = openWindow.tabs!.filter(tab =>
						tab.url === browser.runtime.getURL("/sidepanel.html"));

					const targetTab: Tabs.Tab | undefined = activeTabs.find(tab => tab.pinned);

					if (!targetTab)
						await browser.tabs.create({
							url: browser.runtime.getURL("/sidepanel.html"),
							windowId: openWindow.id,
							active: false,
							pinned: true
						});

					const tabsToClose: Tabs.Tab[] = activeTabs.filter(tab => tab.id !== targetTab?.id);

					if (tabsToClose.length > 0)
						await browser.tabs.remove(tabsToClose.map(tab => tab.id!));
				}
			};

			const updateView = async (viewLocation: SettingsValue<"listLocation">): Promise<void> =>
			{
				logger("updateView", viewLocation);

				browser.tabs.onHighlighted.removeListener(enforcePinnedTab);
				const tabs: Tabs.Tab[] = await browser.tabs.query({
					url: browser.runtime.getURL("/sidepanel.html")
				});
				await browser.tabs.remove(tabs.map(tab => tab.id!));

				await browser.action.setPopup({
					popup: viewLocation === "popup" ? browser.runtime.getURL("/popup.html") : ""
				});

				if (import.meta.env.FIREFOX)
					await browser.sidebarAction.setPanel({
						panel: viewLocation === "sidebar" ? browser.runtime.getURL("/sidepanel.html") : ""
					});
				else
					await chrome.sidePanel.setOptions({ enabled: viewLocation === "sidebar" });

				if (viewLocation === "pinned")
				{
					enforcePinnedTab();
					browser.tabs.onHighlighted.addListener(enforcePinnedTab);
				}
			};

			updateView(await settings.listLocation.getValue());
			settings.listLocation.watch(updateView);
		}

		function performContextAction(action: string, windowId: number): void
		{
			if (action === "show_collections")
			{
				if (listLocation === "sidebar" || listLocation === "popup")
					openCollectionsInView(listLocation, windowId);
				else
					openCollectionsInTab();
			}
			else
				saveTabs(action === "set_aside");
		}

		function openCollectionsInView(view: "sidebar" | "popup", windowId: number): void
		{
			if (view === "sidebar")
			{
				if (import.meta.env.FIREFOX)
					browser.sidebarAction.open();
				else
					chrome.sidePanel.open({ windowId });
			}
			else
				browser.action.openPopup();
		}

		async function openCollectionsInTab(): Promise<void>
		{
			logger("openCollectionsInTab");

			const currentWindow: Windows.Window = await browser.windows.getCurrent({ populate: true });

			if (currentWindow.incognito)
			{
				let availableWindows: Windows.Window[] = await browser.windows.getAll({ populate: true });

				availableWindows = availableWindows.filter(window =>
					!window.incognito &&
					window.tabs?.some(i => i.url === browser.runtime.getURL("/sidepanel.html"))
				);

				if (availableWindows.length > 0)
				{
					const availableTab: Tabs.Tab = availableWindows[0].tabs!.find(
						tab => tab.url === browser.runtime.getURL("/sidepanel.html")
					)!;

					await browser.tabs.update(availableTab.id, { active: true });
					await browser.windows.update(availableWindows[0].id!, { focused: true });

					return;
				}

				await browser.windows.create({
					url: browser.runtime.getURL("/sidepanel.html"),
					focused: true
				});
			}
			else
			{
				const collectionTab: Tabs.Tab | undefined = currentWindow.tabs!.find(
					tab => tab.url === browser.runtime.getURL("/sidepanel.html")
				);

				if (collectionTab)
					await browser.tabs.update(collectionTab.id, { active: true });
				else
					await browser.tabs.create({
						url: browser.runtime.getURL("/sidepanel.html"),
						active: true,
						windowId: currentWindow.id
					});
			}
		}

		async function saveTabs(closeAfterSave: boolean): Promise<void>
		{
			logger("saveTabs", closeAfterSave);

			const collection: CollectionItem = await saveTabsToCollection(closeAfterSave);
			const [savedCollections, cloudIssue] = await getCollections();
			const newList = [collection, ...savedCollections];

			await saveCollections(newList, cloudIssue === null, graphicsCache);

			sendMessage("refreshCollections", undefined);

			if (await settings.notifyOnSave.getValue())
				await sendNotification({
					title: i18n.t("notifications.tabs_saved.title"),
					message: i18n.t("notifications.tabs_saved.message"),
					icon: "/notification_icons/cloud_checkmark.png"
				});
		}
	}
	catch (ex)
	{
		console.error(ex);
		trackError("background_error", ex as Error);
	}
});
