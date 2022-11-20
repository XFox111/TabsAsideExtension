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
	 * Tab's thumbnail (optional)
	 */
	public Thumbnail?: string;

	/**
	 * Tab's favicon (optional)
	 */
	public Icon?: string;

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
	 * @param graphics Tab's graphics data
	 */
	constructor(uri: string, title: string, scrollPoisition: number, thumbnail: string);
	constructor(uri: string, title?: string, scrollPosition?: number, thumbnail?: string)
	{
		this.Url = uri;
		this.Title = title;
		this.Thumbnail = thumbnail;
		this.ScrollPosition = scrollPosition;
	}

	public GetIcon(): string
	{
		if (this.Icon)
			return this.Icon;

		let url = new URL(this.Url);
		url.pathname = "/favicon.ico";
		return url.href;
	}
}
