//This variable is populated when the browser action icon is clicked, or a command is called (with a shortcut for example).
//We can't populate it later, as selected tabs get deselected on a click inside a tab.
var tabsToSave = [];


//Get the tabs to save, either all the window or the selected tabs only, and pass them through a callback.
function GetTabsToSave(callback)
{
		chrome.tabs.query({ currentWindow: true }, (windowTabs) =>
		{
			var highlightedTabs = windowTabs.filter(item => item.highlighted);
			//If there are more than one selected tab in the window, we set only those aside.
			// Otherwise, all the window's tabs get saved.
			return callback((highlightedTabs.length > 1 ? highlightedTabs : windowTabs));
		});

}

function TogglePane(tab)
{
	if (tab.url.startsWith("http")
		&& !tab.url.includes("chrome.google.com")
		&& !tab.url.includes("addons.mozilla.org")
		&& !tab.url.includes("microsoftedge.microsoft.com"))
	{
		chrome.tabs.executeScript(tab.id,
			{
				file: "js/aside-script.js",
				allFrames: true,
				runAt: "document_idle"
			});
	}
	else if (tab.url == chrome.runtime.getURL("TabsAside.html"))
		chrome.tabs.remove(tab.id);
	else
	{
		chrome.tabs.create(
			{
				url: chrome.extension.getURL("TabsAside.html"),
				active: true
			},
			(activeTab) =>
				chrome.tabs.onActivated.addListener(function TabsAsideCloser(activeInfo)
				{
					chrome.tabs.query({ url: chrome.extension.getURL("TabsAside.html") }, (result) =>
					{
						if (result.length)
							setTimeout(() =>
							{
								result.forEach(i =>
									{
									if (activeInfo.tabId != i.id)
										chrome.tabs.remove(i.id);
									});
							}, 200);
						else chrome.tabs.onActivated.removeListener(TabsAsideCloser);
					});
				}));
	}
}

function ProcessCommand(command)
{
	GetTabsToSave((returnedTabs) =>
	{
		tabsToSave = returnedTabs;
		switch(command)
		{
			case "set-aside":
				SaveCollection();
				break;
			case "toggle-pane":
				chrome.tabs.query(
					{
						active: true,
						currentWindow: true
					},
					(tabs) => TogglePane(tabs[0])
				)
				break;
		}
	});
}

chrome.browserAction.onClicked.addListener((tab) =>
{
	GetTabsToSave((returnedTabs) =>
	{
		tabsToSave = returnedTabs;

		chrome.storage.sync.get({ "setAsideOnClick": false }, values =>
		{
			if (values?.setAsideOnClick)
				SaveCollection();
			else
				TogglePane(tab);
		});
	});
});

var collections = [];

function UpdateCollectionStorage() {
	chrome.storage.sync.set({ "sets": collections });
}

/**
 * Load the collections global variable from the storage, updates the theme and eventually sends the collections to a callback 
 * @param {function} callback A function that will be called after the collections values are obtained. These collections are sent as an argument to the callback.
 */
function LoadCollectionsStorage(callback=null){
	chrome.storage.sync.get("sets", values =>
	{
		collections = values?.sets || [];		
		UpdateTheme();
		callback(collections)
	});
}

/**
 * Merges a provided collections array with older pre v2 collections,
 * saving the result into the new post v2 storage. 
 * 
 * Allows to preserve backward compatibility with the localStorage method of storing collections in pre v2 versions
 * 
 * @param {Object[]} collections The array of current collections
 */
function MergePreV2Collections(collections){
	if (localStorage.getItem("sets"))	
		{
			console.log("Found pre-v2 data");
			collections = collections.concat(JSON.parse(localStorage.getItem("sets")))
			UpdateCollectionStorage()
			localStorage.removeItem("sets");
		}
}

LoadCollectionsStorage(MergePreV2Collections)

chrome.storage.onChanged.addListener((changes, namespace) =>
{
	if (namespace == "sync")
		for (key in changes)
			switch(key){
				case "sets":
					collections = changes[key].newValue;
					chrome.runtime.sendMessage(
						{ 
							command: "reloadCollections" ,
							collections : collections
						}
					);
				break;

			//TODO : Add settings keys here as well, from aside-script.js

			}
});

var shortcuts;
chrome.commands.getAll((commands) => shortcuts = commands);

chrome.commands.onCommand.addListener(ProcessCommand);
chrome.contextMenus.onClicked.addListener((info) => ProcessCommand(info.menuItemId));

chrome.runtime.onInstalled.addListener((reason) => 
{
	chrome.tabs.create({ url: "https://github.com/XFox111/TabsAsideExtension/releases/latest" });
	// Adding context menu options
	chrome.contextMenus.create(
		{
			id: "toggle-pane",
			contexts: ["browser_action"],
			title: chrome.i18n.getMessage("togglePaneContext")
		}
	);
	chrome.contextMenus.create(
		{
			id: "set-aside",
			contexts: ["browser_action"],
			title: chrome.i18n.getMessage("setAside")
		}
	);
});

//We receive a message from the pane aside-script, which means the tabsToSave are already assigned on message reception.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
{
	switch (message.command)
	{
		case "openTab":
			chrome.tabs.create({ url: message.url });
			break;
		case "saveTabs":
			SaveCollection();
			break;
		case "loadData":
			LoadCollectionsStorage(sendResponse)//Sends the collections as a response
			return true;//Required to indicate the answer will be sent asynchronously https://developer.chrome.com/extensions/messaging
		break;				
		case "restoreTabs":
			RestoreCollection(message.collectionIndex, message.removeCollection);
			sendResponse();
			break;
		case "deleteTabs":
			DeleteCollection(message.collectionIndex);
			sendResponse();
			break;
		case "removeTab":
			RemoveTab(message.collectionIndex, message.tabIndex);
			sendResponse();
			break;
		case "renameCollection":
			collections[message.collectionIndex].name = message.newName;
			UpdateCollectionStorage()
			break;
		case "togglePane":
			chrome.tabs.query(
				{
					active: true,
					currentWindow: true
				},
				(tabs) => TogglePane(tabs[0])
			)
			break;
		case "getShortcuts":
			sendResponse(shortcuts);
			break;
	}
});

// This function updates the extension's toolbar icon
function UpdateTheme()
{
	// Updating badge counter
	chrome.browserAction.setBadgeText({ text: collections.length < 1 ? "" : collections.length.toString() });

	if (chrome.theme)	// Firefox sets theme automatically
		return;

	var theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	var iconStatus = collections.length ? "full" : "empty";

	var basePath = "icons/" + theme + "/" + iconStatus + "/";

	chrome.browserAction.setIcon(
		{
			path:
			{
				"128": basePath + "128.png",
				"48": basePath + "48.png",
				"32": basePath + "32.png",
				"16": basePath + "16.png"
			}
		});
}

chrome.windows.onFocusChanged.addListener(UpdateTheme);
chrome.tabs.onUpdated.addListener(UpdateTheme);
chrome.tabs.onActivated.addListener(UpdateTheme);

// Set current tabs aside
function SaveCollection()
{
	var tabs = tabsToSave.filter(i => i.url != chrome.runtime.getURL("TabsAside.html") && !i.pinned && !i.url.includes("//newtab") && !i.url.includes("about:blank") && !i.url.includes("about:home"));

	if (tabs.length < 1)
	{
		alert(chrome.i18n.getMessage("noTabsToSave"));
		return;
	}

	var collection =
	{
		timestamp: Date.now(),
		tabsCount: tabs.length,
		titles: tabs.map(tab => tab.title ?? ""),
		links: tabs.map(tab => tab.url ?? ""),
		icons: tabs.map(tab => tab.favIconUrl ?? ""),
		thumbnails: tabs.map(tab => thumbnails.find(i => i.tabId == tab.id)?.url ?? "")
	};

	collections.unshift(collection);
	UpdateCollectionStorage()

	var newTabId;
	chrome.tabs.create({}, (tab) =>
	{
		newTabId = tab.id;
		chrome.tabs.remove(tabsToSave.filter(i => !i.pinned && i.id != newTabId).map(tab => tab.id));
	});

	UpdateTheme();
}

function DeleteCollection(collectionIndex)
{
	collections = collections.filter(i => i != collections[collectionIndex]);
	UpdateCollectionStorage();

	UpdateTheme();
}

function RestoreCollection(collectionIndex, removeCollection)
{
	collections[collectionIndex].links.forEach(i =>
	{
		chrome.tabs.create(
			{
				url: i,
				active: false
			},
			(createdTab) =>
			{
				chrome.storage.sync.get({ "loadOnRestore" : true }, values =>
				{
					if (!(values?.loadOnRestore))
						chrome.tabs.onUpdated.addListener(function DiscardTab(updatedTabId, changeInfo, updatedTab)
						{
							if (updatedTabId === createdTab.id) {
								chrome.tabs.onUpdated.removeListener(DiscardTab);
								if (!updatedTab.active) {
									chrome.tabs.discard(updatedTabId);
								}
							}
						});
				});
			});
	});

	//We added new tabs by restoring a collection, so we refresh the array of tabs ready to be saved.
	GetTabsToSave((returnedTabs) =>
	tabsToSave = returnedTabs)

	if (!removeCollection)
		return;

	collections = collections.filter(i => i != collections[collectionIndex]);
	UpdateCollectionStorage()

	UpdateTheme();
}

function RemoveTab(collectionIndex, tabIndex)
{
	var set = collections[collectionIndex];
	if (--set.tabsCount < 1)
	{
		collections = collections.filter(i => i != set);
		UpdateCollectionStorage()

		UpdateTheme();
		return;
	}

	var titles = [];
	var links = [];
	var icons = [];

	for (var i = set.links.length - 1; i >= 0; i--)
	{
		if (i == tabIndex)
			continue;

		titles.unshift(set.titles[i]);
		links.unshift(set.links[i]);
		icons.unshift(set.icons[i]);
	}

	set.titles = titles;
	set.links = links;
	set.icons = icons;

	UpdateCollectionStorage()

	UpdateTheme();
}

var thumbnails = [];

function AppendThumbnail(tabId, tab)
{
	if (!tab.active || !tab.url.startsWith("http"))
		return;

	chrome.tabs.captureVisibleTab(
		{
			format: "jpeg",
			quality: 1
		},
		(dataUrl) =>
		{
			if (!dataUrl)
			{
				console.log("Failed to retrieve thumbnail");
				return;
			}

			console.log("Thumbnail retrieved");
			var item = thumbnails.find(i => i.tabId == tabId);
			if (item)
				item.url = dataUrl;
			else
				thumbnails.unshift(
					{
						tabId: tabId,
						url: dataUrl
					}
				);
		}
	);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
{
	if (changeInfo.status === "complete")
		AppendThumbnail(tabId, tab)
});
