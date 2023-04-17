export class CollectionModel
{
	public static readonly PREFIX: string = "set_";

	timestamp: number | null;
	tabsCount: number;
	name?: string;
	titles: string[];
	links: string[];
}

export class GraphicsModel
{
	public iconUrl?: string;
	public pageCapture?: string;
}

export class SettingsModel
{
	public loadOnRestore: boolean = true;
	public setAsideOnClick: boolean = false;
	public showDeleteDialog: boolean = true;
	public listview: boolean = true;
}

export class GraphicsCollectionModel
{
	public static readonly KEY: string = "thumbnails";

	[key: string]: GraphicsModel;
}
