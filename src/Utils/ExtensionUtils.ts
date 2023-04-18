import { Tabs } from "webextension-polyfill";
import ext from "./ext";
import { isFirefox } from "react-device-detect";

export async function CreateTab(options: Tabs.CreateCreatePropertiesType): Promise<Tabs.Tab>
{
	console.log("CreateTab", options);

	if (ext)
		return await ext.tabs.create(options);

	window.open(options.url, "_blank");
	return null;
}

export async function OpenSettings(): Promise<void>
{
	if (ext)
		await ext.runtime.openOptionsPage();
	else
		window.open("/options.html", "_blank");
}

export async function OpenShortcutsPage(): Promise<Tabs.Tab>
{
	if (ext)
	{
		if (isFirefox)
		{
			alert("On the opened page under 'Manage Your Extension', click the gear icon -> 'Manage Extension Shortcuts'");
			return await ext.tabs.create({ url: "about:addons" });
		}
		else
			return await ext.tabs.create({ url: "chrome://extensions/shortcuts" });
	}
	else
		return null;
}

export async function GetSelectedTabs(): Promise<Tabs.Tab[]>
{
	if (ext)
		return await ext.tabs.query({ highlighted: true, currentWindow: true });
	else
		return [];
}
