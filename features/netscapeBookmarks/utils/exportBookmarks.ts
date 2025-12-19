import { getCollectionTitle } from "@/entrypoints/sidepanel/utils/getCollectionTitle";
import { getCollections } from "@/features/collectionStorage";
import { CollectionItem, GroupItem } from "@/models/CollectionModels";

export default async function exportBookmarks(): Promise<void>
{
	const [collections] = await getCollections();
	const lines: string[] = [
		"<!DOCTYPE NETSCAPE-Bookmark-file-1>",
		"<!-- This is an automatically generated file.",
		"    It will be read and overwritten.",
		"    DO NOT EDIT! -->",
		"<META HTTP-EQUIV=\"Content-Type\" CONTENT=\"text/html; charset=UTF-8\">",
		"<TITLE>Bookmarks</TITLE>",
		"<H1>Bookmarks</H1>",
		"<DL><p>"
	];

	for (const collection of collections)
		lines.push(...createFolder(collection));

	lines.push("</DL><p>");

	const data: string = lines.join("\n");

	const blob: Blob = new Blob([data], { type: "text/html" });

	const element: HTMLAnchorElement = document.createElement("a");
	element.style.display = "none";
	element.href = URL.createObjectURL(blob);
	element.setAttribute("download", "collections.html");

	document.body.appendChild(element);
	element.click();

	URL.revokeObjectURL(element.href);
	document.body.removeChild(element);
}

function createFolder(item: CollectionItem | GroupItem): string[]
{
	const lines: string[] = [];
	const title: string = item.type === "collection" ?
		(item.title ?? getCollectionTitle(item)) :
		(item.pinned ? i18n.t("groups.pinned") : (item.title ?? ""));

	lines.push(`<DT><H3>${sanitizeString(title)}</H3>`);
	lines.push("<DL><p>");

	for (const subItem of item.items)
	{
		if (subItem.type === "tab")
			lines.push(`<DT><A HREF="${encodeURI(subItem.url)}">${sanitizeString(subItem.title || subItem.url)}</A>`);
		else if (subItem.type === "group")
			lines.push(...createFolder(subItem));
	}

	lines.push("</DL><p>");
	return lines;
}

function sanitizeString(str: string): string
{
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
