import { settings } from "./settings";

export async function getTabsToSaveAsync(forceSelected: boolean = false): Promise<[Browser.tabs.Tab[], number]>
{
	let tabs: Browser.tabs.Tab[] = await browser.tabs.query({
		currentWindow: true,
		highlighted: true
	});

	if (!forceSelected && tabs.length < 2)
	{
		const ignorePinned: boolean = await settings.ignorePinned.getValue();
		tabs = await browser.tabs.query({
			currentWindow: true,
			pinned: ignorePinned ? false : undefined
		});
	}

	const tabsCount: number = tabs.length;
	const extension_prefix: string = browser.runtime.getURL("/");

	tabs = tabs.filter(i =>
		i.url
		&& new URL(i.url).protocol !== "about:"
		&& new URL(i.url).hostname !== "newtab"
		&& !i.url!.startsWith(extension_prefix)
	);

	return [tabs, tabsCount - tabs.length];
}
