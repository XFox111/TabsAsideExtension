export type TabItem =
	{
		type: "tab";
		url: string;
		title?: string;
	};

export type PinnedGroupItem =
	{
		type: "group";
		pinned: true;
		items: TabItem[];
	};

export type DefaultGroupItem =
	{
		type: "group";
		pinned?: false;
		title?: string;
		color: `${Browser.tabGroups.Color}`;
		items: TabItem[];
	};

export type GroupItem = PinnedGroupItem | DefaultGroupItem;

export type CollectionItem =
	{
		type: "collection";
		timestamp: number;
		title?: string;
		color?: `${Browser.tabGroups.Color}`;
		items: (TabItem | GroupItem)[];
	};

export type GraphicsStorage = Record<string, GraphicsItem>;

export type GraphicsItem =
	{
		preview?: string;
		capture?: string;
		icon?: string;
	};
