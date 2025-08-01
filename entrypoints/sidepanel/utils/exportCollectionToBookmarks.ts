import { CollectionItem, TabItem } from "@/models/CollectionModels";
import sendNotification from "@/utils/sendNotification";
import { Bookmarks } from "wxt/browser";
import { getCollectionTitle } from "./getCollectionTitle";

export default async function exportCollectionToBookmarks(collection: CollectionItem)
{
	const rootFolder: Bookmarks.BookmarkTreeNode = await browser.bookmarks.create({
		title: getCollectionTitle(collection)
	});

	for (let i = 0; i < collection.items.length; i++)
	{
		const item = collection.items[i];

		if (item.type === "tab")
		{
			await createTabBookmark(item, rootFolder.id);
		}
		else
		{
			const groupFolder = await browser.bookmarks.create({
				parentId: rootFolder.id,
				title: item.pinned
					? `📌 ${i18n.t("groups.pinned")}` :
					(item.title?.trim() || `${i18n.t("groups.title")} ${i}`)
			});

			for (const tab of item.items)
				await createTabBookmark(tab, groupFolder.id);
		}
	}

	await sendNotification({
		title: i18n.t("notifications.bookmark_saved.title"),
		message: i18n.t("notifications.bookmark_saved.message"),
		icon: "/notification_icons/bookmark_add.png"
	});
}

async function createTabBookmark(tab: TabItem, parentId: string): Promise<void>
{
	await browser.bookmarks.create({
		parentId,
		title: tab.title?.trim() || tab.url,
		url: tab.url
	});
};
