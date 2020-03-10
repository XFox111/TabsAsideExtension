function UpdateTheme()
{
	if (window.matchMedia("(prefers-color-scheme: dark)").matches)
	{
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
chrome.tabs.onZoomChange.addListener(UpdateTheme);

// TODO: Load saved tabs