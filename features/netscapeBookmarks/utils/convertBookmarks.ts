import { CollectionItem, GraphicsStorage, GroupItem, TabItem } from "@/models/CollectionModels";
import { Bookmark } from "node-bookmarks-parser/build/interfaces/bookmark";

export default function convertBookmarks(bookmarks: Bookmark[]): [CollectionItem[], GraphicsStorage, number]
{
	let count: number = 0;
	const graphics: GraphicsStorage = {};
	const items: CollectionItem[] = [];
	const untitled: CollectionItem = {
		items: [],
		timestamp: Date.now(),
		type: "collection"
	};

	for (const bookmark of bookmarks)
	{
		if (bookmark.type === "bookmark")
		{
			untitled.items.push(getTab(bookmark, graphics));
			count++;
		}
		else if (bookmark.type === "folder")
		{
			const collection: CollectionItem = getCollection(bookmark, graphics);
			items.push(collection);
			count += collection.items.reduce((acc, item) =>
			{
				if (item.type === "tab")
					return acc + 1;
				else if (item.type === "group")
					return acc + item.items.length;
				return acc;
			}, 0);
		}
	}

	if (untitled.items.length > 0)
		items.unshift(untitled);

	return [items, graphics, count];
}

function getTab(bookmark: Bookmark, graphics: GraphicsStorage): TabItem
{
	if (bookmark.icon)
		graphics[bookmark.url!] = {
			icon: bookmark.icon
		};

	return {
		type: "tab",
		url: bookmark.url!,
		title: bookmark.title || bookmark.url!
	};
}

function getCollection(bookmark: Bookmark, graphics: GraphicsStorage): CollectionItem
{
	const collection: CollectionItem = {
		items: [],
		title: bookmark.title,
		timestamp: Date.now(),
		type: "collection"
	};

	if (bookmark.children)
		for (const child of bookmark.children)
		{
			if (child.type === "bookmark")
				collection.items.push(getTab(child, graphics));
			else if (child.type === "folder" && child.children)
				collection.items.push(getGroup(child, graphics));
		}

	return collection;
}

function getGroup(bookmark: Bookmark, graphics: GraphicsStorage): GroupItem
{
	const group: GroupItem = {
		items: [],
		title: bookmark.title,
		pinned: false,
		type: "group",
		color: getRandomColor()
	};

	if (bookmark.children)
		for (const child of bookmark.children)
		{
			if (child.type === "bookmark")
				group.items.push(getTab(child, graphics));
			else if (child.type === "folder")
				group.items.push(...getGroup(child, graphics).items);
		}

	return group;
}

function getRandomColor(): "blue" | "cyan" | "green" | "grey" | "orange" | "pink" | "purple" | "red" | "yellow"
{
	const colors = ["blue", "cyan", "green", "grey", "orange", "pink", "purple", "red", "yellow"] as const;
	return colors[Math.floor(Math.random() * colors.length)];
}
