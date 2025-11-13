import { TabItem } from "@/models/CollectionModels";
import sendNotification from "@/utils/sendNotification";

export default async function getSelectedTabs(): Promise<TabItem[]>
{
	let tabs: Browser.tabs.Tab[] = await browser.tabs.query({ currentWindow: true, highlighted: true });
	const tabCount: number = tabs.length;

	tabs = tabs.filter(i =>
		i.url
		&& new URL(i.url).protocol !== "about:"
		&& new URL(i.url).hostname !== "newtab"
	);

	if (tabs.length < tabCount)
		await sendNotification({
			title: i18n.t("notifications.partial_save.title"),
			message: i18n.t("notifications.partial_save.message"),
			icon: "/notification_icons/save_warning.png"
		});

	return tabs.map(i => ({ type: "tab", url: i.url!, title: i.title }));
}
