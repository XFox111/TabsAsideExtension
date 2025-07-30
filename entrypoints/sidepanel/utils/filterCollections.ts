import { getCollectionTitle } from "@/entrypoints/sidepanel/utils/getCollectionTitle";
import { CollectionItem, TabItem } from "@/models/CollectionModels";

export default function filterCollections(
	collections: CollectionItem[] | null,
	filter: CollectionFilterType
): CollectionItem[]
{
	if (!collections || collections.length < 1)
		return [];

	if (!filter.query && filter.colors.length < 1)
		return collections;

	const query: string = filter.query.toLocaleLowerCase();

	return collections.filter(collection =>
	{
		let querySatisfied: boolean = query.length < 1 ||
			getCollectionTitle(collection).toLocaleLowerCase().includes(query);
		let colorSatisfied: boolean = filter.colors.length < 1 ||
			filter.colors.includes(collection.color ?? "none");

		if (querySatisfied && colorSatisfied)
			return true;

		function probeTab(tab: TabItem, query: string): boolean
		{
			return tab.title?.toLocaleLowerCase().includes(query) || tab.url.toLocaleLowerCase().includes(query);
		}

		for (const item of collection.items)
		{
			if (item.type === "tab" && !querySatisfied)
			{
				querySatisfied = probeTab(item, query);
			}
			else if (item.type === "group")
			{
				if (item.pinned !== true)
				{
					if (!querySatisfied)
						querySatisfied = (item.title?.toLocaleLowerCase() ?? "").includes(query);

					if (!colorSatisfied)
						colorSatisfied = filter.colors.includes(item.color);
				}

				if (!querySatisfied)
					querySatisfied = item.items.some(i => probeTab(i, query));
			}

			if (querySatisfied && colorSatisfied)
				return true;
		}

		return false;
	});
}

export type CollectionFilterType =
	{
		query: string;
		colors: (chrome.tabGroups.ColorEnum | "none")[];
	};
