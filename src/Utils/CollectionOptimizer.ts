import CollectionModel from "../Models/Data/CollectionModel";
import GroupModel from "../Models/Data/GroupModel";
import TabModel from "../Models/Data/TabModel";
import ext from "./ext";

/**
 * Optimizes the collection storage size by converting the collection to a more compact format.
 */
export default class CollectionOptimizer
{
	/**
	 * Split result data structure into chunks (default chunk size: 8183 bytes).
	 * @param data data to split.
	 * @description Default chunk size is 8183 bytes (storage.sync.QUOTA_BYTES_PER_ITEM - 9)
	 */
	public static SplitIntoChunks(data: string): string[];
	/**
	 * Split result data structure into chunks.
	 * @param data data to split.
	 * @param chunkSize max size of each chunk.
	 */
	public static SplitIntoChunks(data: string, chunkSize: number): string[];
	public static SplitIntoChunks(data: string, chunkSize?: number): string[]
	{
		let chunks: string[] = [];

		chunkSize ??= ext.storage.sync.QUOTA_BYTES_PER_ITEM - "chunkXX".length - 2;
		// Remark:
		// QUOTA_BYTES_PER_ITEM includes length of key name, length of content and 2 more bytes (for unknown reason).

		while (data.length > 0)
		{
			chunks.push(data.substring(0, chunkSize));
			data = data.substring(chunkSize);
		}

		return chunks;
	}

	/**
	 * Serializes collection data structure into a compact format string.
	 * @param collections collections to optimize.
	 * @returns optimized collection data structure.
	 */
	public static SerializeCollections(collections: CollectionModel[]): string
	{
		let data: string = "";

		for (let collection of collections)
		{
			data += CollectionOptimizer.GetCollectionString(collection);

			for (let item of collection.Items)
			{
				if (item instanceof GroupModel)
				{
					data += CollectionOptimizer.GetGroupString((item as GroupModel));

					for (let tab of (item as GroupModel).Tabs)
					{
						data += "\t";
						data += CollectionOptimizer.GetTabString(tab);
					}
				}
				else
					data += CollectionOptimizer.GetTabString(item as TabModel);
			}
		}

		return data;
	}

	/**
	 * Deserializes collection data structure from a compact format string.
	 * @param data data to deserialize.
	 * @returns deserialized array of collection models.
	 */
	public static DeserializeCollections(data: string): CollectionModel[]
	{
		if (!data)
			return [];

		let collections: CollectionModel[] = [];

		let lines: string[] = data.split("\n");

		for (let line of lines)
		{
			if (line.startsWith("c"))
			{
				let collection: CollectionModel = CollectionOptimizer.GetCollection(line);
				collections.push(collection);
			}
			else if (line.startsWith("\tg"))
			{
				let group: GroupModel = CollectionOptimizer.GetGroup(line);
				collections[collections.length - 1].Items.push(group);
			}
			else if (line.startsWith("\t\tt"))
			{
				let tab: TabModel = CollectionOptimizer.GetTab(line);

				let colIndex: number = collections.length - 1;
				let groupIndex: number = collections[colIndex].Items.length - 1;

				(collections[colIndex].Items[groupIndex] as GroupModel).Tabs.push(tab);
			}
			else if (line.startsWith("\tt"))
			{
				let tab: TabModel = CollectionOptimizer.GetTab(line);
				collections[collections.length - 1].Items.push(tab);
			}
		}

		return collections;
	}

	// #region Decompression functions
	private static GetCollection(data: string): CollectionModel
	{
		return new CollectionModel(
			data.match(/(?<=.*\|).*/)?.toString(),
			data.match(/(?<=c\d+\/)[a-z]{1,}\b/)?.toString() as chrome.tabGroups.ColorEnum,
			parseInt(data.match(/(?<=c)\d+/).toString())
		);
	}

	private static GetGroup(data: string): GroupModel
	{
		let isPinned: boolean = data.match(/g\/p/)?.toString() ? true : false;

		if (isPinned)
			return new GroupModel();

		return new GroupModel(
			data.match(/(?<=g\/)[a-z]{1,}\b/).toString() as chrome.tabGroups.ColorEnum,
			data.match(/(?<=.*\|).*/)?.toString(),
			data.search(/(?<=g\/[a-z]+)\.c/) !== -1
		);
	}

	private static GetTab(data: string): TabModel
	{
		return new TabModel(
			data.match(/(?<=t.*\|).*(?=\|)/).toString(),
			data.match(/(?<=t.*\|.*\|).+/)?.toString()
		);
	}
	// #endregion

	// #region Compression functions
	private static GetCollectionString(collection: CollectionModel): string
	{
		let data: string = `c${collection.Timestamp}`;

		if (collection.Color)
			data += `/${collection.Color}`;

		if (collection.Title)
			data += `|${collection.Title}`;

		data += "\n";

		return data;
	}

	private static GetGroupString(group: GroupModel): string
	{
		let data: string = `\tg`;

		if (group.IsPinned)
			data += "/p";
		else
		{
			data += `/${group.Color}`;

			if (group.IsCollapsed)
				data += ".c";

			if (group.Title)
				data += `|${group.Title}`;
		}

		data += "\n";

		return data;
	}

	private static GetTabString(tab: TabModel): string
	{
		let data: string = "\tt";

		data += `|${tab.Url}|`;

		if (tab.Title)
			data += `${tab.Title}`;

		data += "\n";

		return data;
	}
	// #endregion
}
