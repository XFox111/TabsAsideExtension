import GroupModel from "./GroupModel";
import TabModel from "./TabModel";

/**
 * Represents an instance of a saved tabs collection.
 */
export default class CollectionModel
{
	/**
	 * Collection's unique identifier. Represents collection's time of creation (UNIX timestamp).
	 */
	public Timestamp: number;

	/**
	 * Collection's name.
	 */
	public Title?: string;

	/**
	 * Collection's color.
	 */
	public Color?: chrome.tabGroups.ColorEnum;

	/**
	 * Collection's child items.
	 */
	public Items: (TabModel | GroupModel)[] = [];

	constructor();
	/**
	 * @param title Collection's name.
	 */
	constructor(title: string);
	/**
	 * @param title Collection's name.
	 * @param color Collection's color.
	 */
	constructor(title: string, color: chrome.tabGroups.ColorEnum);
	/**
	 * @param title Collection's name.
	 * @param color Collection's color.
	 * @param timestamp Collection's unique identifier. Represents collection's time of creation (UNIX timestamp).
	 */
	constructor(title: string, color: chrome.tabGroups.ColorEnum, timestamp: number);
	constructor(title?: string, color?: chrome.tabGroups.ColorEnum, timestamp?: number)
	{
		this.Timestamp = timestamp ?? new Date().getTime();
		this.Title = title;
		this.Color = color;
	}

	/**
	 * Returns collection's title if present, or a string representation of its timestamp otherwise.
	 * @returns Collection's title.
	 */
	public GetTitle(): string
	{
		return this.Title ?? new Date(this.Timestamp).toLocaleDateString(navigator.language, { year: "numeric", month: "short", day: "numeric" });
	}

	/**
	 * Returns all tabs inside the collection, including ones inside groups.
	 * @returns All tabs inside the collection.
	 */
	public GetAllTabs(): TabModel[]
	{
		let tabs: TabModel[] = [];

		tabs.push(...this.Items.filter(item => item instanceof TabModel).map(item => item as TabModel));
		tabs.push(...this.Items.filter(item => item instanceof GroupModel).map(item => item as GroupModel).flatMap(group => group.Tabs));

		return tabs;
	}

	/**
	 * Returns all groups inside the collection.
	 * @returns All groups inside the collection.
	 */
	public GetAllGroups(): GroupModel[]
	{
		return this.Items.filter(item => item instanceof GroupModel).map(item => item as GroupModel);
	}
}
