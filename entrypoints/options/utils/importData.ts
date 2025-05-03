import { sendMessage } from "@/utils/messaging";

export default async function importData(): Promise<boolean | null>
{
	const element: HTMLInputElement = document.createElement("input");
	element.style.display = "none";
	element.hidden = true;
	element.type = "file";
	element.accept = ".json";

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
		const data: any = JSON.parse(content);

		if (data.local)
			await browser.storage.local.set(data.local);

		if (data.sync)
			await browser.storage.sync.set(data.sync);
	}
	catch (error)
	{
		console.error("Failed to parse JSON", error);
		return false;
	}

	sendMessage("refreshCollections", undefined);

	return true;
}
