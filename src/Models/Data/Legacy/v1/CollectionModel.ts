export default class CollectionModel
{
	public static readonly KEY: string = "sets";

	public timestamp: number;
	public tabsCount: number;
	public name?: string;
	public titles: string[];
	public links: string[];
	public icons: string[];
	public thumbnails: string[];
}
