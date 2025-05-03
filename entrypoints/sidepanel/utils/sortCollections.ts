import { getCollectionTitle } from "@/entrypoints/sidepanel/utils/getCollectionTitle";
import { CollectionItem } from "@/models/CollectionModels";

export default function sortCollections(
	collections: CollectionItem[],
	mode?: CollectionSortMode | null
): CollectionItem[]
{
	return sorters[mode ?? "custom"]([...collections]);
}

export type CollectionSortMode = "ascending" | "descending" | "newest" | "oldest" | "custom";

const sorters: Record<CollectionSortMode, CollectionSorter> =
{
	ascending: i => i.sort((a, b) => getCollectionTitle(a).localeCompare(getCollectionTitle(b))),
	descending: i => i.sort((a, b) => getCollectionTitle(b).localeCompare(getCollectionTitle(a))),
	newest: i => i.sort((a, b) => b.timestamp - a.timestamp),
	oldest: i => i.sort((a, b) => a.timestamp - b.timestamp),
	custom: i => i
};

type CollectionSorter = (collections: CollectionItem[]) => CollectionItem[];
