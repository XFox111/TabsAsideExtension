export default class CollectionModel
{
	public static readonly PREFIX: string = "set_";

	timestamp: number | null;
	tabsCount: number;
	name?: string;
	titles: string[];
	links: string[];
}
