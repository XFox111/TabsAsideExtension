export class CollectionModel
{
	public static readonly KEY: string = "sets";

	public timestamp: number;
	public tabsCount: number;
	public name?: string;
	public titles: string[];
	public links: string[];
	public icons: string[];
	public thumbnails?: string[];
}

export class SettingsModel
{
	public loadOnRestore: boolean = true;
	public setAsideOnClick: boolean = false;
	public showDeleteDialog: boolean = true;
}
