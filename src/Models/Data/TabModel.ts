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
	 * @param uri Tab's URL
	 */
	constructor(uri: string);
	/**
	 * @param uri Tab's URL
	 * @param title Tab's title
	 */
	constructor(uri: string, title: string);
	constructor(uri: string, title?: string)
	{
		this.Url = uri;
		this.Title = title;
	}
}
