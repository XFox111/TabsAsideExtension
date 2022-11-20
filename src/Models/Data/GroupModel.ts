import TabModel from "./TabModel";

/**
 * Represents a group of tabs.
 */
export default class GroupModel
{
	/**
	 * Are tabs inside this group pinned
	 */
	public IsPinned: boolean;

	/**
	 * Group's title. Empty if pinned or unnamed.
	 */
	public Title?: string;

	/**
	 * Group's color. Mandatory if not pinned.
	 */
	public Color?: chrome.tabGroups.ColorEnum;

	/**
	 * Collapse group on restore.
	 */
	public IsCollapsed?: boolean;

	/**
	 * Group's child items.
	 */
	public Tabs: TabModel[] = [];

	/**
	 * Creates a new pinned instance of a group.
	 */
	constructor();
	/**
	 * Creates a new instance of a group (not pinned).
	 * @param color Group's color.
	 */
	constructor(color: chrome.tabGroups.ColorEnum);
	/**
	 * Creates a new instance of a group (not pinned).
	 * @param color Group's color.
	 * @param title Group's title.
	 * @param isCollapsed Collapse group on restore.
	 */
	constructor(color: chrome.tabGroups.ColorEnum, title: string, isCollapsed?: boolean);
	constructor(color?: chrome.tabGroups.ColorEnum, title?: string, isCollapsed?: boolean)
	{
		if (color)
		{
			this.Title = title;
			this.Color = color;
			this.IsCollapsed = isCollapsed ?? false;
			this.IsPinned = false;
		}
		else
			this.IsPinned = true;
	}
}
