import { compress, decompress } from "lzutf8";
import { Storage } from "webextension-polyfill";
import { CollectionModel } from "../../Models/Data";
import { ext } from "../../Utils";
import CollectionOptimizer from "../../Utils/CollectionOptimizer";

/**
 * Data repository that provides access to saved collections.
 */
export default class CollectionsRepository
{
	/**
	 * Fired when collections are changed.
	 */
	public ItemsChanged: (collections: CollectionModel[]) => void;

	private source: Storage.StorageArea = null;

	/**
	 * Generates a new instance of the class.
	 * @param source Storage area to be used
	 */
	public constructor(source: "sync" | "local")
	{
		this.source = source === "sync" ? ext?.storage.sync : ext?.storage.local;
		ext?.storage.onChanged.addListener(this.OnStorageChanged);
	}

	/**
	 * Gets saved collections from repository.
	 * @returns Saved collections
	 */
	public async GetCollectionsAsync(): Promise<CollectionModel[]>
	{
		if (!this.source)
			return [];

		let chunks: { [key: string]: string; } = { };

		// Setting which data to retrieve and its default value
		// Saved collections are now stored in chunks. This is the most efficient way to store these.
		for (let i = 0; i < 12; i++)
			chunks[`chunk${i}`] = null;

		chunks = await this.source.get(chunks);

		let data: string = "";

		for (let chunk of Object.values(chunks))
			if (chunk)
				data += chunk;

		data = decompress(data, { inputEncoding: "StorageBinaryString" });

		return CollectionOptimizer.DeserializeCollections(data);
	}

	/**
	 * Adds new collection to repository.
	 * @param collection Collection to be saved
	 */
	public async AddCollectionAsync(collection: CollectionModel): Promise<void>
	{
		if (!this.source)
			return;

		let items: CollectionModel[] = await this.GetCollectionsAsync();
		items.push(collection);

		await this.SaveChangesAsync(items);
	}

	/**
	 * Updates existing collection or adds a new one in repository.
	 * @param collection Collection to be updated
	 */
	public async UpdateCollectionAsync(collection: CollectionModel): Promise<void>
	{
		if (!this.source)
			return;

		let items: CollectionModel[] = await this.GetCollectionsAsync();
		let index = items.findIndex(i => i.Timestamp === collection.Timestamp);

		if (index === -1)
			items.push(collection);
		else
			items[index] = collection;

		await this.SaveChangesAsync(items);
	}

	/**
	 * Removes collection from repository.
	 * @param collection Collection to be removed
	 */
	public async RemoveCollectionAsync(collection: CollectionModel): Promise<void>
	{
		if (!this.source)
			return;

		let items: CollectionModel[] = await this.GetCollectionsAsync();
		items = items.filter(i => i.Timestamp !== collection.Timestamp);

		await this.SaveChangesAsync(items);
	}

	/**
	 * Removes all collections from repository.
	 */
	public async Clear(): Promise<void>
	{
		if (!this.source)
			return;

		let keys: string[] = [];

		for (let i = 0; i < 12; i++)
			keys.push(`chunk${i}`);

		await this.source.remove(keys);
	}

	private async SaveChangesAsync(collections: CollectionModel[]): Promise<void>
	{
		if (!this.source)
			return;

		let data: string = CollectionOptimizer.SerializeCollections(collections);
		data = compress(data, { outputEncoding: "StorageBinaryString" });

		let chunks: string[] = CollectionOptimizer.SplitIntoChunks(data);

		let items: { [key: string]: string; } = {};

		for (let i = 0; i < chunks.length; i++)
		items[`chunk${i}`] = chunks[i];

		let chunksToDelete: string[] = [];

		for (let i = chunks.length; i < 12; i++)
			chunksToDelete.push(`chunk${i}`);

		await this.source.set(items);
		await this.source.remove(chunksToDelete);
	}

	private async OnStorageChanged(changes: { [key: string]: Storage.StorageChange }, areaName: string): Promise<void>
	{
		if (!this.source)
			return;

		if (!Object.keys(changes).some(k => k.startsWith("chunk")))
			return;

		let collections: CollectionModel[] = await this.GetCollectionsAsync();
		this.ItemsChanged?.(collections);
	}
}
