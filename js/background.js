chrome.browserAction.onClicked.addListener(function (tab)
{
	if (tab.url.startsWith("http")
		&& !tab.url.includes("chrome.google.com")
		&& !tab.url.includes("microsoftedge.microsoft.com"))
	{
		chrome.tabs.insertCSS(
			{
				file: "css/style.css",
				allFrames: true,
				runAt: "document_idle"
			});
		chrome.tabs.insertCSS(
			{
				file: "css/style.generic.css",
				allFrames: true,
				runAt: "document_idle"
			});
		chrome.tabs.insertCSS(
			{
				file: "css/style.dark.css",
				allFrames: true,
				runAt: "document_idle"
			});

		chrome.tabs.executeScript(tab.id,
			{
				file: "js/aside-script.js",
				allFrames: true,
				runAt: "document_idle"
			});
	}
	else if (tab.url.startsWith("chrome-extension") && tab.url.endsWith("TabsAside.html"))
		chrome.tabs.remove(tab.id);
	else
	{
		chrome.tabs.create({
			url: chrome.extension.getURL("TabsAside.html"),
			active: true
		},
			chrome.tabs.onActivated.addListener(function TabsAsideCloser(activeInfo) {
				chrome.tabs.query({ url: chrome.extension.getURL("TabsAside.html") }, function (result) {
					if (result.length)
						setTimeout(function () {
							result.forEach(i => {
								if (activeInfo.tabId != i.id)
									chrome.tabs.remove(i.id);
							});
						}, 200);
					else chrome.tabs.onActivated.removeListener(TabsAsideCloser);
				});
			}));
	}
});


function UpdateTheme()
{
	if (window.matchMedia("(prefers-color-scheme: dark)").matches)
	{
		if (collections.length)
			chrome.browserAction.setIcon(
				{
					path:
					{
						"128": "icons/dark/full/128.png",
						"48": "icons/dark/full/48.png",
						"32": "icons/dark/full/32.png",
						"16": "icons/dark/full/16.png"
					}
				});
		else
			chrome.browserAction.setIcon(
				{
					path:
					{
						"128": "icons/dark/empty/128.png",
						"48": "icons/dark/empty/48.png",
						"32": "icons/dark/empty/32.png",
						"16": "icons/dark/empty/16.png"
					}
				});
	}
	else
	{
		if (collections.length)
			chrome.browserAction.setIcon(
				{
					path:
					{
						"128": "icons/light/full/128.png",
						"48": "icons/light/full/48.png",
						"32": "icons/light/full/32.png",
						"16": "icons/light/full/16.png"
					}
				});
		else
			chrome.browserAction.setIcon(
				{
					path:
					{
						"128": "icons/light/empty/128.png",
						"48": "icons/light/empty/48.png",
						"32": "icons/light/empty/32.png",
						"16": "icons/light/empty/16.png"
					}
				});
	}
}

var collections = JSON.parse(localStorage.getItem("sets"));
if (collections == null)
	collections = [];

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse)
{
	switch (message.command)
	{
		case "openTab":
			chrome.tabs.create({ url: message.url });
			break;
		case "loadData":
			sendResponse(collections);
			break;
		case "saveTabs":
			SaveCollection();
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
		case "toFavorites":
			AddTabsToFavorites(message.collectionIndex);
			break;
		case "share":
			ShareTabs(message.collectionIndex);
			break;
	}
});

UpdateTheme();
chrome.windows.onCreated.addListener(UpdateTheme);
chrome.windows.onRemoved.addListener(UpdateTheme);
chrome.windows.onFocusChanged.addListener(UpdateTheme);

chrome.tabs.onUpdated.addListener(UpdateTheme);
chrome.tabs.onCreated.addListener(UpdateTheme);
chrome.tabs.onMoved.addListener(UpdateTheme);
chrome.tabs.onSelectionChanged.addListener(UpdateTheme);
chrome.tabs.onActiveChanged.addListener(UpdateTheme);
chrome.tabs.onActivated.addListener(UpdateTheme);
chrome.tabs.onHighlightChanged.addListener(UpdateTheme);
chrome.tabs.onHighlighted.addListener(UpdateTheme);
chrome.tabs.onDetached.addListener(UpdateTheme);
chrome.tabs.onAttached.addListener(UpdateTheme);
chrome.tabs.onRemoved.addListener(UpdateTheme);
chrome.tabs.onReplaced.addListener(UpdateTheme);

function SaveCollection()
{
	chrome.tabs.query({ currentWindow: true }, function (rawTabs)
	{
		var tabs = rawTabs.filter(i => !(i.url.startsWith("chrome-extension") && i.url.endsWith("TabsAside.html")) && !i.pinned && !i.url.includes("//newtab"));

		if (tabs.length < 1)
		{
			alert("No tabs available to save");
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

		var rawData;
		if (localStorage.getItem("sets") === null)
			rawData = [collection];
		else
		{
			rawData = JSON.parse(localStorage.getItem("sets"));
			rawData.unshift(collection);
		}

		localStorage.setItem("sets", JSON.stringify(rawData));

		collections = JSON.parse(localStorage.getItem("sets"));

		var newTabId;
		chrome.tabs.create({}, function(tab) { newTabId = tab.id; });
		
		chrome.tabs.remove(rawTabs.filter(i => !i.url.startsWith("chrome-extension") && !i.url.endsWith("TabsAside.html") && !i.pinned && i.id != newTabId).map(tab => tab.id));

		UpdateTheme();
	});
}

function DeleteCollection(collectionIndex)
{
	collections = collections.filter(i => i != collections[collectionIndex]);
	localStorage.setItem("sets", JSON.stringify(collections));

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
			} , function (createdTab)
		{
			chrome.storage.sync.get({ "loadOnRestore" : false }, values => {
				if (!values.loadOnRestore)
					chrome.tabs.onUpdated.addListener(function discarder(updatedTabId, changeInfo, updatedTab) {
						if (updatedTabId === createdTab.id) {
							chrome.tabs.onUpdated.removeListener(discarder);
							if (!updatedTab.active) {
								chrome.tabs.discard(updatedTabId);
							}
						}
					});
			});
		});
	});

	if (!removeCollection)
		return;

	collections = collections.filter(i => i != collections[collectionIndex]);
	localStorage.setItem("sets", JSON.stringify(collections));

	UpdateTheme();
}

function AddTabsToFavorites(collectionIndex)
{
	alert("Adding to favorites");
	/*for (var i = 0; i < collections[collectionIndex].links.length; i++)
	{
		chrome.bookmarks.create(
			{
				title: collections[collectionIndex].titles[i],
				url: collections[collectionIndex].links[i],
			});
	}*/
}

function ShareTabs(collectionId)
{
	alert("Sharing");
}

function RemoveTab(collectionIndex, tabIndex)
{
	var set = collections[collectionIndex];
	if (--set.tabsCount < 1)
	{
		collections = collections.filter(i => i != set);
		localStorage.setItem("sets", JSON.stringify(collections));

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

	localStorage.setItem("sets", JSON.stringify(collections));

	UpdateTheme();
}

var thumbnails = [];

function AppendThumbnail(tabId, cahngeInfo, tab)
{
	if (!tab.active || !tab.url.startsWith("http"))
		return;

	chrome.tabs.captureVisibleTab(
		{
			format: "jpeg",
			quality: 1
		},
		function (dataUrl)
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

chrome.tabs.onUpdated.addListener(AppendThumbnail);
