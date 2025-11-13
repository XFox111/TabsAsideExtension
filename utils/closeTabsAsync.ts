export async function closeTabsAsync(tabs: Browser.tabs.Tab[]): Promise<void>
{
	if (tabs.length < 1)
		return;

	await browser.tabs.create({
		active: true,
		windowId: tabs[0].windowId
	});
	await browser.tabs.remove(tabs.map(i => i.id!));
}
