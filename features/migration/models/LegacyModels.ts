export type LegacyCollection =
	{
		timestamp: number;
		tabsCount: number;
		titles: string[];
		links: string[];
		icons?: string[];
		thumbnails?: string[];
	};

export type LegacyGraphics =
	{
		pageCapture?: string;
		iconUrl?: string;
	};
