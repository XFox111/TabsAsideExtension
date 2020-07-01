if (window.location === window.parent.location && window.location.protocol != "chrome-extension:")	// For open/close call
{
	var iframe = document.querySelector("iframe.tabsAsideIframe");
	if (!iframe)
	{
		iframe = document.createElement('iframe');

		iframe.setAttribute("class", "tabsAsideIframe");

		iframe.style.position = "fixed";
		iframe.style.zIndex = "9000000000000000000";

		iframe.style.height = "100%";
		iframe.style.width = "100%";

		iframe.style.top = "0px";
		iframe.style.right = "0px";
		iframe.style.left = "0px";
		iframe.style.bottom = "0px";

		iframe.style.border = "none";
		iframe.style.background = "transparent";
		iframe.style.opacity = 0;

		iframe.onload = function ()
		{
			setTimeout(function () 
			{
				iframe.style.opacity = 1;
			}, 100);
		};

		iframe.src = chrome.extension.getURL("TabsAside.html");
		document.body.appendChild(iframe);
	}
	else
	{
		iframe.contentWindow.postMessage({ target: "TabsAside", command: "TogglePane" }, "*");
		setTimeout(function ()
		{
			iframe.remove();
		}, 250);
	}
}
else // For init call
	Initialize();

function Initialize()
{
	var pane = document.querySelector(".tabsAside.pane");

	if (window.location !== window.parent.location)
	{
		pane.setAttribute("embedded", "");
		window.addEventListener('message', event => {
			// IMPORTANT: check the origin of the data! 
			if (event.data.target == "TabsAside")
			{
				pane.parentElement.style.opacity = 0;
				pane.removeAttribute("opened");
			}
		}); 
	}

	if (window.matchMedia("(prefers-color-scheme: dark)").matches)
	{
		pane.parentElement.setAttribute("darkmode", "");
		document.querySelector("#icon").href = "icons/dark/empty/16.png";
	}

	document.querySelector(".tabsAside .saveTabs").onclick = SetTabsAside;

	document.querySelector("nav > p > small").textContent = chrome.runtime.getManifest()["version"];

	var loadOnRestoreCheckbox = document.querySelector("nav > p > input[type=checkbox]");
	chrome.storage.sync.get({ "loadOnRestore": false },
		values => loadOnRestoreCheckbox.checked = values.loadOnRestore
	);
	chrome.storage.onChanged.addListener(function (changes, namespace) {
		if (namespace == 'sync'){
			for (key in changes) {
				if (key === 'loadOnRestore') {
					loadOnRestoreCheckbox.checked = changes[key].newValue
				}
			}
		}
	});
	loadOnRestoreCheckbox.addEventListener("click", function ()
	{
		chrome.storage.sync.set(
			{
				"loadOnRestore": loadOnRestoreCheckbox.checked
			});
	});

	document.querySelectorAll(".tabsAside.pane > header nav button").forEach(i => 
	{
		i.onclick = function () { window.open(i.value, '_blank'); };
	});

	chrome.runtime.sendMessage({ command: "loadData" }, function (collections)
	{
		if (document.querySelector(".tabsAside.pane section div") == null)
			collections.forEach(i => 
			{
				AddCollection(i);
			});
	});

	setTimeout(function ()
	{
		pane.setAttribute("opened", "");
	}, 100);
}

function AddCollection(collection)
{
	var list = document.querySelector(".tabsAside section");
	list.querySelector("h2").setAttribute("hidden", "");

	var rawTabs = "";

	for (var i = 0; i < collection.links.length; i++)
	{
		rawTabs +=
			"<div title='" + collection.titles[i] + "'" + ((collection.thumbnails && collection.thumbnails[i]) ? " style='background-image: url(" + collection.thumbnails[i] + ")'" : "") + ">" +
				"<span class='openTab' value='" + collection.links[i] + "'></span>" +
				"<div>" +
					"<div" + ((collection.icons[i] == 0 || collection.icons[i] == null) ? "" : " style='background-image: url(\"" + collection.icons[i] + "\")'") + "></div>" +
					"<span>" + collection.titles[i] + "</span>" +
					"<button class='btn remove' title='Remove tab from collection'></button>" +
				"</div>" +
			"</div>";
	}

	list.innerHTML +=
		"<div>" +
			"<div>" +
				"<span>Tabs: " + collection.links.length + "</span>" +
				"<small>" + GetAgo(collection.timestamp) + "</small>" +
				"<a class='restoreCollection'>Restore tabs</a>" +
				"<div>" +
					"<button class='btn more' title='More...'></button>" +
					"<nav>" +
						"<button class='restoreCollection noDelete'>Restore without removing</button>" +
					"</nav>" +
				"</div>" +
				"<button class='btn remove' title='Remove collection'></button>" +
			"</div>" +

			"<div class='tabsList'>" + rawTabs + "</div>" +
		"</div>"

	list.querySelectorAll(".restoreCollection").forEach(i => 
	{
		i.onclick = function () { RestoreTabs(i.parentElement.parentElement) };
	});

	list.querySelectorAll(".restoreCollection.noDelete").forEach(i => 
	{
		i.onclick = function () { RestoreTabs(i.parentElement.parentElement.parentElement.parentElement, false) };
	});

	list.querySelectorAll(".openTab").forEach(i => 
	{
		i.onclick = function ()
		{
			chrome.runtime.sendMessage(
				{
					command: "openTab",
					url: i.getAttribute("value")
				}
			);
		};
	});

	document.querySelectorAll(".btn.remove").forEach(i => 
	{
		i.onclick = function () { RemoveTabs(i.parentElement.parentElement) };
	});

	document.querySelectorAll(".tabsList .btn.remove").forEach(i => 
	{
		i.onclick = function () { RemoveOneTab(i.parentElement.parentElement) };
	});
}

function SetTabsAside()
{
	chrome.runtime.sendMessage({ command: "saveTabs" });
}

function RestoreTabs(collectionData, removeCollection = true)
{
	chrome.runtime.sendMessage(
		{
			command: "restoreTabs",
			removeCollection: removeCollection,
			collectionIndex: Array.prototype.slice.call(collectionData.parentElement.children).indexOf(collectionData) - 1
		},
		function ()
		{
			if (removeCollection)
				RemoveCollectionElement(collectionData);
		}
	);
}

function RemoveTabs(collectionData)
{
	if (!confirm("Are you sure you want to delete this collection?"))
		return;

	chrome.runtime.sendMessage(
		{
			command: "deleteTabs",
			collectionIndex: Array.prototype.slice.call(collectionData.parentElement.children).indexOf(collectionData) - 1
		},
		function () { RemoveCollectionElement(collectionData); }
	);
}

function RemoveOneTab(tabData)
{
	if (!confirm("Are you sure you want to delete this tab?"))
		return;

	chrome.runtime.sendMessage(
		{
			command: "removeTab",
			collectionIndex: Array.prototype.slice.call(tabData.parentElement.parentElement.parentElement.children).indexOf(tabData.parentElement.parentElement) - 1,
			tabIndex: Array.prototype.slice.call(tabData.parentElement.children).indexOf(tabData)
		},
		function ()
		{
			tabData.parentElement.previousElementSibling.children[0].textContent = "Tabs: " + (tabData.parentElement.children.length - 1);
			if (tabData.parentElement.children.length < 2)
			{
				RemoveElement(tabData.parentElement.parentElement);
				if (document.querySelector("tabsAside.pane > section").children.length < 2)
					setTimeout(function ()
					{
						document.querySelector(".tabsAside.pane > section > h2").removeAttribute("hidden");
					}, 250);
			}
			else
				RemoveElement(tabData);
		});
}

function GetAgo(timestamp)
{
	var minutes = (Date.now() - timestamp) / 60000;

	if (minutes < 1)
		return "Just now";

	else if (Math.floor(minutes) == 1)
		return "1 minute ago";
	else if (minutes < 60)
		return Math.floor(minutes) + " minutes ago";

	else if (Math.floor(minutes / 60) == 1)
		return "1 hour ago";
	else if (minutes < 24 * 60)
		return Math.floor(minutes / 60) + " hours ago";

	else if (Math.floor(minutes / 24 / 60) == 1)
		return "1 day ago";
	else if (minutes < 7 * 24 * 60)
		return Math.floor(minutes / 24 / 60) + " days ago";

	else if (Math.floor(minutes / 7 / 24 / 60) == 1)
		return "1 week ago";
	else if (minutes < 30 * 24 * 60)
		return Math.floor(minutes / 7 / 24 / 60) + " weeks ago";

	else if (Math.floor(minutes / 30 / 24 / 60) == 1)
		return "1 month ago";
	else if (minutes < 365 * 24 * 60)
		return Math.floor(minutes / 30 / 24 / 60) + " months ago";

	else if (Math.floor(minutes / 24 / 60) == 365)
		return "1 year ago";
	else
		return Math.floor(minutes / 365 / 24 / 60) + "years ago";
}

function RemoveElement(el)
{
	el.style.opacity = 0;
	setTimeout(function ()
	{
		el.remove();
	}, 200);
}

function RemoveCollectionElement(el)
{
	RemoveElement(el);
	if (el.parentElement.children.length < 2)
		setTimeout(function ()
		{
			document.querySelector(".tabsAside.pane > section > h2").removeAttribute("hidden");
		}, 250);	
}

// TODO: Add more actions
// TODO: Make backup system