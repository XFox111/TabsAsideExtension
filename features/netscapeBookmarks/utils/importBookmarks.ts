import { getCollections, saveCollections } from "@/features/collectionStorage";
import { sendMessage } from "@/utils/messaging";
import parse from "node-bookmarks-parser";
import { Bookmark } from "node-bookmarks-parser/build/interfaces/bookmark";
import convertBookmarks from "./convertBookmarks";

export default async function importBookmarks(): Promise<number | null>
{
	const element: HTMLInputElement = document.createElement("input");
	element.style.display = "none";
	element.hidden = true;
	element.type = "file";
	element.accept = ".html";

	document.body.appendChild(element);
	element.click();

	await new Promise(resolve =>
	{
		const listener = () =>
		{
			element.removeEventListener("input", listener);
			resolve(null);
		};
		element.addEventListener("input", listener);
	});

	if (!element.files || element.files.length < 1)
		return null;

	const file: File = element.files[0];
	const content: string = await file.text();

	document.body.removeChild(element);

	try
	{
		const bookmarks: Bookmark[] = parse(content);
		const [data, graphics, tabCount] = convertBookmarks(bookmarks);
		const [collections, cloudIssues] = await getCollections();

		await saveCollections([...data, ...collections], cloudIssues === null, graphics);
		sendMessage("refreshCollections", undefined);

		return tabCount;
	}
	catch (error)
	{
		console.error("Failed to parse bookmarks file", error);
		return -1;
	}
}
