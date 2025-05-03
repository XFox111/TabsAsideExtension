import { TabItem } from "@/models/CollectionModels";
import { Tabs } from "wxt/browser";

export default async function getSelectedTabs(): Promise<TabItem[]>
{
	const tabs: Tabs.Tab[] = await browser.tabs.query({ currentWindow: true, highlighted: true });
	return tabs.filter(i => i.url).map(i => ({ type: "tab", url: i.url!, title: i.title }));
}
