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

collections = [];
thumbnails = {};

/*
	Updates the thumbnail storage, then the collection synced storage. Calls the onSuccess callback when successful, and onFailure when failed.
	@param {function} onSuccess A function without arguments, that will be called after the collections and thumbnails values are obtained, if collections are successfully updated
	@param {function} onFailure A function that will be called with the error, after the collections and thumbnails values are obtained, if collections are not successfully updated
 */
function UpdateStorages(onSuccess=()=>null,onFailure=(error)=>{throw error.message}){
	//The collections storage is updated after the thumbnail storage, so that the thumbnails are ready when the collections are updated.
	chrome.storage.local.set({ "thumbnails": thumbnails },
		() => chrome.storage.sync.set({ "sets": collections }, () => {
			if (chrome.runtime.lastError==undefined)
				onSuccess()
			else
				onFailure(chrome.runtime.lastError)
			})
	);
}
/**
 * Load the thumbnails and collections global variable from the storage, updates the theme and eventually sends the collections and thumbnails to a callback
 * @param {function} callback A function that will be called after the collections and thumbnails values are obtained.
 * These collections and thumbnails are sent as a data={"collections":collections,"thumbnails":thumbnails} argument to the callback.
 */
function LoadStorages(callback=()=>null){
	chrome.storage.local.get("thumbnails", values =>
	{
		thumbnails = values?.thumbnails || {};
		chrome.storage.sync.get("sets", values =>
		{
			collections = values?.sets || [];
			UpdateTheme();
			callback({"collections":collections,"thumbnails":thumbnails})
		});
	});
}

/**
 * Merges a provided collections array with older pre v2 collections,
 * saving the result into the new post v2 storage.
 * Allows to preserve backward compatibility with the localStorage method of storing collections in pre v2 versions.
 * @param {Object[]} collections The array of current collections
 */
function MergePreV2Collections({collections}){
	if (localStorage.getItem("sets"))
		{
			console.log("Found pre-v2 data");
			old_collections=JSON.parse(localStorage.getItem("sets"))
			//Remove thumbnails to follow the new format .
			old_collections.forEach(collection => {
				for (var i = 0; i < collection.links.length; i++){
					thumbnails[collection.links[i]]=collection.thumbnails[i]
				}
				delete collection.thumbnails
			});
			collections = collections.concat(old_collections)
			UpdateStorages(()=>localStorage.removeItem("sets"))//Remove the older sets on success update success only.
		}
}

LoadStorages(MergePreV2Collections)

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
							collections : collections,
							thumbnails : thumbnails
						}
					);
					UpdateTheme()
					break;
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
			LoadStorages(sendResponse)//Sends the collections as a response
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
			UpdateStorages()
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
		icons: tabs.map(tab => tab.favIconUrl ?? "")
	};
	tabs.forEach(tab => {//For each tab to save :
		//Add relevant thumbnail in the thumbnails object if any.
		thumbnails[tab.url]=sessionThumbnails[tab.url] || thumbnails[tab.url]
	})

	collections.unshift(collection);
	UpdateStorages(()=>
		{
			chrome.tabs.create({}, (tab) =>
			{
				var newTabId = tab.id;
				chrome.tabs.remove(tabsToSave.filter(i => !i.pinned && i.id != newTabId).map(tab => tab.id));
			});
		},(error)=>{
			LoadStorages()//Restore the previous values without changing anything.
			alert(chrome.i18n.getMessage("errorSavingTabs"))
		}
	);
}

function DeleteCollection(collectionIndex)
{
	var deletedUrls=collections[collectionIndex].links
	collections = collections.filter(i => i != collections[collectionIndex]);

	ForEachUnusedUrl(deletedUrls,(url)=>delete thumbnails[url])

	UpdateStorages();
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
	GetTabsToSave((returnedTabs) => tabsToSave = returnedTabs)

	if (!removeCollection)
		return;

	DeleteCollection(collectionIndex);
}

function RemoveTab(collectionIndex, tabIndex)
{
	var set = collections[collectionIndex];
	if (--set.tabsCount < 1)
	{
		DeleteCollection(collectionIndex);
		return;
	}

	const urlToRemove=set.links[tabIndex].url
	set.titles.splice(tabIndex,1);
	set.links.splice(tabIndex,1);
	set.icons.splice(tabIndex,1);

	ForEachUnusedUrl([urlToRemove],(url)=>delete thumbnails[url]);

	UpdateStorages()
}

/**
 * Execute a callback for each url in urlsToFilter that is not in any collection urls
 * @param {Array} urlsToFilter array of urls to check
 * @param {function} callback callback to execute on an url
 */
function ForEachUnusedUrl(urlsToFilter,callback)
{
	for (var i = 0; i < urlsToFilter.length; i++) {
		if (!collections.some(collection => collection.links.some(link=> link==urlsToFilter[i]))){
			//If the url of the tab n°i is not present among all the collections, we call the callback on it
			callback(urlsToFilter[i])
		}
	}
}

//Session thumbnails are not always used in a collection, so we keep them in a specific variable until a collection is saved.
var sessionThumbnails = {};

function AppendThumbnail(tabId, tab)
{
	if (!tab.active || !tab.url.startsWith("http"))
		return;

	chrome.tabs.captureVisibleTab(
		{
			format: "jpeg",
			quality: 1
		},
		(image) =>
		{
			if (!image)
			{
				console.log("Failed to retrieve thumbnail");
				return;
			}

			console.log("Thumbnail retrieved");
			sessionThumbnails[tab.url]=image;
		}
	);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
{
	if (changeInfo.status === "complete")
		AppendThumbnail(tabId, tab)
});
