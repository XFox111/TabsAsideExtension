/**
 * Represents a saved tab.
 */
export default class TabModel
{
	/**
	 * Tab's URL
	 */
	public Url: string;

	/**
	 * Tab's title (optional)
	 */
	public Title?: string;

	/**
	 * Tab's scroll position (optional)
	 */
	public ScrollPosition?: number;

	/**
	 * @param uri Tab's URL
	 */
	constructor(uri: string);
	/**
	 * @param uri Tab's URL
	 * @param title Tab's title
	 */
	constructor(uri: string, title: string);
	/**
	 * @param uri Tab's URL
	 * @param title Tab's title
	 * @param scrollPoisition Tab's scroll position
	 */
	constructor(uri: string, title: string, scrollPoisition: number);
	/**
	 * @param uri Tab's URL
	 * @param title Tab's title
	 * @param scrollPoisition Tab's scroll position
	 */
	constructor(uri: string, title: string, scrollPoisition: number);
	constructor(uri: string, title?: string, scrollPosition?: number)
	{
		this.Url = uri;
		this.Title = title;
		this.ScrollPosition = scrollPosition;
	}
}
