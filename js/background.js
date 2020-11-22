//This variable is populated when the browser action icon is clicked, or a command is called (with a shortcut for example).
//We can't populate it later, as selected tabs get deselected on a click inside a tab.
var tabsToSave = [];

var syncEnabled=true;//DEBUG - TODO REMOVE OR FALLBACK GRACEFULLY
var collectionStorage= syncEnabled ? chrome.storage.sync : chrome.storage.local;

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

collections = {};
thumbnails = {};

/**
 *	Updates the thumbnail storage, then the collection synced storage. Calls the onSuccess callback when successful, and onFailure when failed.
 *	@param {Object} collectionsToUpdate An object containing one or more collections to be updated. By default, updates the whole "collections" item.
 *	@param {function} onSuccess A function without arguments, that will be called after the collections and thumbnails values are obtained, if collections are successfully updated
 *	@param {function} onFailure A function that will be called with the error, after the collections and thumbnails values are obtained, if collections are not successfully updated
 */
function UpdateStorages(collectionsToUpdate=collections,onSuccess=()=>null,onFailure=(error)=>{throw error.message}){
	//The collections storage is updated after the thumbnail storage, so that the thumbnails are ready when the collections are updated.
	chrome.storage.local.set({ "thumbnails": thumbnails },
		() => collectionStorage.set(compressCollectionsStorage(collectionsToUpdate),
			() => {
				if (chrome.runtime.lastError===undefined)
					onSuccess()
				else
					onFailure(chrome.runtime.lastError)
			})
	);
	//When the collection storage is updated, a listener set up below reacts and updates the collections global variable, so we do not need to update that variable here
}

/**
 * Use a compression mechanism to compress collections in an object, one by one.
 * @param {Object} collectionsToCompress object of collections to compress
 * @returns {Object} Object of compressed stringified collections.
 */
function compressCollectionsStorage(collectionsToCompress){
	var	compressedStorage={};
	for (const [key, value] of Object.entries(collectionsToCompress)){//For each collection in the uncompressed collectionsToCompress
		var cloneWithoutTimestamp = Object.assign({},value,{timestamp: undefined});
		compressedStorage[key]=LZUTF8.compress(JSON.stringify(cloneWithoutTimestamp),{outputEncoding:"StorageBinaryString"});
	}
	return compressedStorage;
}

/**
 * Load and decompresses the thumbnails and collections global variables from the storage, updates the theme and eventually sends the collections and thumbnails to a callback
 * @param {function} callback A function that will be called after the collections and thumbnails values are obtained.
 * These collections and thumbnails are sent as a data={"collections":collections,"thumbnails":thumbnails} argument to the callback.
 */
function LoadStorages(callback=()=>null){
	chrome.storage.local.get("thumbnails", values =>
	{
		thumbnails = values?.thumbnails || {};
		collectionStorage.get(null, values =>
		{
			collections = decompressCollectionsStorage(values);
			UpdateTheme();
			callback({"collections":collections,"thumbnails":thumbnails})
		});
	});
}

/**
 * Use a decompression mechanism to decompress stringified collections in an object, one by one.
 * Ignores non collections items (items with a key not starting with "set_"
 * @param {Object} compressedCollections object of stringified collections to decompress
 * @returns {Object} Object of decompressed and parsed collections.
 */
function decompressCollectionsStorage(compressedCollections){
	var decompressedStorage={}
	for (const [key, value] of Object.entries(compressedCollections)) {
		if (!key.startsWith("set_"))
			continue;

		decompressedStorage[key]=JSON.parse(LZUTF8.decompress(value,{inputEncoding:"StorageBinaryString"}));
		decompressedStorage[key].timestamp=parseInt(key.substr(4))
	}
	return decompressedStorage
}

/**
 * Merges a provided collections array with older pre v2 collections,
 * saving the result into the new post v2 storage, or into bookmarks on failure.
 * Allows to preserve backward compatibility with the localStorage method of storing collections in pre v2 versions.
 * @param {Object} collections The current collections object
 */
function MergePreV2Collections({collections}){
	if (localStorage.getItem("sets"))
		{
			console.log("Found pre-v2 data");
			old_collections=JSON.parse(localStorage.getItem("sets"))
			//Migrate thumbnails and icons to follow the new format .
			old_collections.forEach(collection => {
				for (var i = 0; i < collection.links.length; i++)
					thumbnails[collection.links[i]]={
						"pageCapture":collection.thumbnails[i],
						"iconUrl":collection.icons[i]
					}
				delete collection.thumbnails;
				delete collection.icons;

				UpdateStorages({["set_"+collection.timestamp]:collection},
					()=> null,
					()=> {
						SaveCollectionAsBookmarks(collection);
						alert(chrome.i18n.getMessage("olderDataMigrationFailed"));
					});
			});
			localStorage.removeItem("sets");
		}
}

function SaveCollectionAsBookmarks(collection)
{
	//The id 1 is the browser's bookmark bar
	chrome.bookmarks.create({'parentId': "1",
			'title': 'TabsAside ' + (collection.name ?? new Date(collection.timestamp).toISOString())
		}, (collectionFolder) => {
			for (var i = 0; i < collection.links.length; i++)
				chrome.bookmarks.create(
					{'parentId': collectionFolder.id,
						'title': collection.titles[i],
						'url': collection.links[i]
					});
		});
}

LoadStorages(MergePreV2Collections)

chrome.storage.onChanged.addListener((changes, namespace) =>
{
	if (namespace == "sync")
		for (key in changes)
			if (key.startsWith("set_")){
				if(changes[key].newValue)
				{
					collections[key] = decompressCollectionsStorage({[key]: changes[key].newValue})[key];
					chrome.runtime.sendMessage({
							command: "reloadCollections",
							collections: collections,
							thumbnails: thumbnails
						});
				}else
					delete collections[key]
			}
		UpdateTheme()
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
			RestoreCollection(message.collectionKey, message.removeCollection);
			sendResponse();
			break;
		case "deleteTabs":
			DeleteCollection(message.collectionKey);
			sendResponse();
			break;
		case "removeTab":
			RemoveTab(message.collectionKey, message.tabIndex);
			sendResponse();
			break;
		case "renameCollection":
			collections[message.collectionKey].name = message.newName;
			UpdateStorages({[message.collectionKey]:collections[message.collectionKey]})
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
	var collectionsLength=Object.keys(collections).length
	// Updating badge counter
	chrome.browserAction.setBadgeText({ text: collectionsLength < 1 ? "" : collectionsLength.toString() });

	if (chrome.theme)	// Firefox sets theme automatically
		return;

	var theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	var iconStatus = collectionsLength ? "full" : "empty";

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
		titles: tabs.map(tab => Truncate(tab.title || "", 100)),
		links: tabs.map(tab => tab.url ?? "")
	};
	tabs.forEach(tab => {//For each tab to save, Add relevant thumbnails in the thumbnails object
		thumbnails[tab.url]={
			"pageCapture": sessionCaptures[tab.url] ?? thumbnails[tab.url]?.pageCapture ?? "",
			"iconUrl":tab.favIconUrl ?? ""
		}
	})

	UpdateStorages({["set_"+collection.timestamp]:collection},()=>
		chrome.tabs.create({}, (tab) =>
		{
			var newTabId = tab.id;
			chrome.tabs.remove(tabsToSave.filter(i => !i.pinned && i.id != newTabId).map(tab => tab.id));
		}),
		(error)=>alert(chrome.i18n.getMessage("errorSavingTabs"))
	);
}

function DeleteCollection(collectionKey)
{
	var deletedUrls=collections[collectionKey].links
	delete collections[collectionKey]
	ForEachUnusedUrl(deletedUrls,(url)=>{
		delete thumbnails[url]
		UpdateStorages({})//Updates the thumbnails storage only
	})
	collectionStorage.remove(collectionKey)//Remove the collection from the collectionstorage
}

function RestoreCollection(collectionKey, removeCollection)
{
	collections[collectionKey].links.forEach(i =>
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

	DeleteCollection(collectionKey);
}

function RemoveTab(collectionKey, tabIndex)
{
	var set = collections[collectionKey];
	if (--set.tabsCount < 1)
	{
		DeleteCollection(collectionKey);
		return;
	}

	const urlToRemove=set.links[tabIndex]
	set.titles.splice(tabIndex,1);
	set.links.splice(tabIndex,1);

	ForEachUnusedUrl([urlToRemove],(url)=>{
		delete thumbnails[url];
		UpdateStorages({[collectionKey]:set});
	});
}

/**
 * Execute a callback for each url in urlsToFilter that is not in any collection urls
 * @param {Array} urlsToFilter array of urls to check
 * @param {function} callback callback to execute on an url
 */
function ForEachUnusedUrl(urlsToFilter,callback)
{
	for (var i = 0; i < urlsToFilter.length; i++)//If the url of the tab n°i is not present among all the collections, we call the callback on it
		if (!Object.values(collections).some(collection => collection.links.some(link=> link==urlsToFilter[i])))
			callback(urlsToFilter[i])
}

/**
 * Returns a stringToTruncate by truncating it in order to keep it under n characters
 * @param stringToTruncate
 * @param n desired maximum length for the string
 * @returns {string} a string of length < n, with "..."  appended if it was truncated.
 */
function Truncate(stringToTruncate, n){
	return (stringToTruncate.length > n) ? stringToTruncate.substr(0, n-1-3) + '...' : stringToTruncate;
}


//page Captures are not always used in a collection, so we keep them in a specific variable until a collection is saved.
var sessionCaptures = {};

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
			sessionCaptures[tab.url]=image;
		}
	);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
{
	if (changeInfo.status === "complete")
		AppendThumbnail(tabId, tab)
});
