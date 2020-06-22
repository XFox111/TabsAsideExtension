if (document.location.protocol == "chrome-extension:")
	InitializeStandalone();
else
{
	setTimeout(function ()
	{
		var pane = document.querySelector(".tabsAside.pane");

		if (pane == null)
		{
			var xhr = new XMLHttpRequest();
			xhr.open('GET', chrome.extension.getURL("collections.html"), true);
			xhr.onreadystatechange = function ()
			{
				if (this.status !== 200 || document.querySelector("#aside-pane") != null)
					return;

				if (document.querySelector(".tabsAside.pane") == null)
				{
					document.body.innerHTML += this.responseText;
					chrome.runtime.sendMessage({ command: "loadData" }, function (collections)
					{
						if (document.querySelector(".tabsAside.pane section div") == null)
							collections.forEach(i => 
							{
								AddCollection(i);
							});
					});
				}

				setTimeout(function ()
				{
					pane = document.querySelector(".tabsAside.pane");

					if (window.matchMedia("(prefers-color-scheme: dark)").matches)
						pane.parentElement.setAttribute("darkmode", "");

					document.querySelector(".tabsAside .saveTabs").onclick = SetTabsAside;

					document.querySelector("nav > p > small").textContent = chrome.runtime.getManifest()["version"];

					var loadOnRestoreCheckbox = document.querySelector("nav > p > input[type=checkbox]");
					chrome.storage.sync.get({ "loadOnRestore": false },
						values => loadOnRestoreCheckbox.checked = values.loadOnRestore
					);
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

					document.querySelector(".tabsAside.background").addEventListener("click", function (event)
					{
						if (event.target == pane.parentElement)
						{
							pane.removeAttribute("opened");
							pane.parentElement.style.opacity = 0;
							document.body.style.overflow = "";
							setTimeout(function ()
							{
								pane.parentElement.remove();
							}, 300);
						}
					});

					pane.setAttribute("opened", "");
					pane.parentElement.style.opacity = 1;
					document.body.style.overflow = "hidden";
				}, 50);
			};
			xhr.send();
		}
		else
		{
			if (pane.hasAttribute("opened"))
			{
				pane.removeAttribute("opened");
				pane.parentElement.style.opacity = 0;
				document.body.style.overflow = "";
				setTimeout(function ()
				{
					if (!pane.hasAttribute("opened"))
						pane.parentElement.remove();
				}, 300);
			}
			else
			{
				pane.setAttribute("opened", "");
				pane.parentElement.style.opacity = 1;
			}
		}
	}, 50);
}

function InitializeStandalone()
{
	pane = document.querySelector(".tabsAside.pane");

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
			"<span value='" + collection.links[i] + "'></span>" +
			"<div>" +
			"<div" + ((collection.icons[i] == 0 || collection.icons[i] == null) ? "" : " style='background-image: url(\"" + collection.icons[i] + "\")'") + "></div>" +
			"<span>" + collection.titles[i] + "</span>" +
			"<button title='Remove tab from collection'>&#xE106;</button>" +
			"</div>" +
			"</div>";
	}

	list.innerHTML += "<div>" +
		"<div>" +
		"<span>Tabs: " + collection.links.length + "</span>" +
		"<small>" + GetAgo(collection.timestamp) + "</small>" +
		"<a>Restore tabs</a>" +
		"<div>" +
		"<button title='More...'>&#xE10C;</button>" +
		"<nav>" +
		"<button>Restore without removing</button>" +
		// "<button hidden>Add tabs to favorites</button>" +
		// "<button hidden>Share tabs</button>" +
		"</nav>" +
		"</div>" +
		"<button title='Remove collection'>&#xE106;</button>" +
		"</div>" +

		"<div>" + rawTabs + "</div>" +
		"</div>"

	list.querySelectorAll("a").forEach(i => 
	{
		i.onclick = function () { RestoreTabs(i.parentElement.parentElement) };
	});

	list.querySelectorAll("nav button:first-child").forEach(i => 
	{
		i.onclick = function () { RestoreTabs(i.parentElement.parentElement.parentElement.parentElement, false) };
	});

	list.querySelectorAll("div > div:last-child > div > span").forEach(i => 
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
	})

	document.querySelectorAll(".tabsAside.pane > section > div > div:first-child > button").forEach(i => 
	{
		i.onclick = function () { RemoveTabs(i.parentElement.parentElement) };
	});

	/*document.querySelectorAll(".tabsAside.pane > section > div > div:first-child > div > nav > button:first-child").forEach(i => 
	{
		i.onclick = function () { AddToFavorites(i.parentElement.parentElement.parentElement.parentElement) };
	});
	document.querySelectorAll(".tabsAside.pane > section > div > div:first-child > div > nav > button:last-child").forEach(i => 
	{
		i.onclick = function () { ShareTabs(i.parentElement.parentElement.parentElement.parentElement) };
	});*/

	document.querySelectorAll(".tabsAside.pane > section > div > div:last-child > div > div > button").forEach(i => 
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
			if (!removeCollection)
				return;

			if (collectionData.parentElement.children.length < 3)
			{
				RemoveElement(collectionData);
				setTimeout(function ()
				{
					document.querySelector(".tabsAside.pane > section > h2").removeAttribute("hidden");
				}, 250);
			}
			else
				RemoveElement(collectionData);
		}
	);
}

function RemoveTabs(collectionData)
{
	chrome.runtime.sendMessage(
		{
			command: "deleteTabs",
			collectionIndex: Array.prototype.slice.call(collectionData.parentElement.children).indexOf(collectionData) - 1
		},
		function ()
		{
			if (collectionData.parentElement.children.length < 3)
			{
				RemoveElement(collectionData);
				setTimeout(function ()
				{
					document.querySelector(".tabsAside.pane > section > h2").removeAttribute("hidden");
				}, 250);
			}
			else
				RemoveElement(collectionData);
		}
	);
}

function AddToFavorites(collectionData)
{
	chrome.runtime.sendMessage(
		{
			command: "toFavorites",
			collectionIndex: Array.prototype.slice.call(collectionData.parentElement.children).indexOf(collectionData) - 1
		});
}

function ShareTabs(collectionData)
{
	chrome.runtime.sendMessage(
		{
			command: "share",
			collectionIndex: Array.prototype.slice.call(collectionData.parentElement.children).indexOf(collectionData) - 1
		});
}

function RemoveOneTab(tabData)
{
	chrome.runtime.sendMessage(
		{
			command: "removeTab",
			collectionIndex: Array.prototype.slice.call(tabData.parentElement.parentElement.parentElement.children).indexOf(tabData.parentElement.parentElement) - 1,
			tabIndex: Array.prototype.slice.call(tabData.parentElement.children).indexOf(tabData)
		},
		function ()
		{
			tabData.parentElement.previousElementSibling.children[0].textContent = "Tabs: " + tabData.parentElement.children.length - 1;
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

// TODO: Add more actions
// TODO: Make backup system