import Tab from "./Tab";

export default class Group
{
	public Id: number;
	public Title: string;
	public Color: chrome.tabGroups.ColorEnum;
	public IsCollapsed: boolean;
	public IsPinned: boolean;
	public Tabs: Tab[];
}
