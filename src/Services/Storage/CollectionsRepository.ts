import { compress, decompress } from "lzutf8";
import { Storage } from "webextension-polyfill";
import CollectionModel from "../../Models/Data/CollectionModel";
import ext from "../../Utils/ext";
import CollectionOptimizer from "../../Utils/CollectionOptimizer";

// TODO: Create fallback mechanism if storage is full

/**
 * Data repository that provides access to saved collections.
 */
export default class CollectionsRepository
{
	/**
	 * Fired when collections are changed.
	 */
	public ItemsChanged: (collections: CollectionModel[], count: number) => void;

	/**
	 * Generates a new instance of the class.
	 */
	public constructor()
	{
		ext?.storage.sync.onChanged.addListener(e => this.OnStorageChanged(e));
	}

	/**
	 * Gets number of saved collections.
	 * @returns Number of saved collections
	 */
	public async GetCountAsync(): Promise<number>
	{
		if (!ext)
			return 0;

		return (await ext.storage.sync.get({ CollectionsCount: 0 })).CollectionsCount;
	}

	/**
	 * Gets saved collections from repository.
	 * @returns Saved collections
	 */
	public async GetAsync(): Promise<CollectionModel[]>
	{
		if (!ext)
			return [];

		let data: string = await this.GetRawDataAsync();

		return CollectionOptimizer.DeserializeCollections(data);
	}

	/**
	 * Adds new collection to repository.
	 * @param collection Collection to be saved
	 */
	public async AddAsync(...collection: CollectionModel[]): Promise<void>
	{
		if (!ext)
			return;

		let items: CollectionModel[] = await this.GetAsync();
		items.push(...collection);

		await this.SaveChangesAsync(items);
	}

	/**
	 * Updates existing collection or adds a new one in repository.
	 * @param collection Collection to be updated
	 */
	public async AddOrUpdateAsync(collection: CollectionModel): Promise<void>
	{
		if (!ext)
			return;

		let items: CollectionModel[] = await this.GetAsync();
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
	public async RemoveAsync(collection: CollectionModel): Promise<void>
	{
		if (!ext)
			return;

		let items: CollectionModel[] = await this.GetAsync();
		items = items.filter(i => i.Timestamp !== collection.Timestamp);

		await this.SaveChangesAsync(items);
	}

	/**
	 * Removes all collections from repository.
	 */
	public async ClearAsync(): Promise<void>
	{
		if (!ext)
			return;

		let keys: string[] = [];

		for (let i = 0; i < 12; i++)
			keys.push(`chunk${i}`);

		await ext.storage.sync.remove(keys);
		await ext.storage.sync.set({ CollectionsCount: 0 });
	}

	private async SaveChangesAsync(collections: CollectionModel[]): Promise<void>
	{
		if (!ext)
			return;

		let data: string = CollectionOptimizer.SerializeCollections(collections);
		data = compress(data, { outputEncoding: "StorageBinaryString" });

		let chunks: string[] = CollectionOptimizer.SplitIntoChunks(data);

		let items: Record<string, any> = {};

		for (let i = 0; i < chunks.length; i++)
			items[`chunk${i}`] = chunks[i];

		items["CollectionsCount"] = collections.length;

		let chunksToDelete: string[] = [];

		for (let i = chunks.length; i < 12; i++)
			chunksToDelete.push(`chunk${i}`);

		await ext.storage.sync.set(items);
		await ext.storage.sync.remove(chunksToDelete);
	}

	private async OnStorageChanged(changes: Storage.StorageAreaSyncOnChangedChangesType): Promise<void>
	{
		if (!ext)
			return;

		if (!Object.keys(changes).some(k => k === "CollectionsCount"))
			return;

		let collections: CollectionModel[] = await this.GetAsync();
		this.ItemsChanged?.(collections, collections.length);
	}

	private async GetRawDataAsync(): Promise<string>
	{
		let chunks: Record<string, string> = { };

		// Setting which data to retrieve and its default value
		// Saved collections are now stored in chunks. This is the most efficient way to store these.
		for (let i = 0; i < 12; i++)
			chunks[`chunk${i}`] = null;

		chunks = await ext.storage.sync.get(chunks);

		let data: string = "";

		for (let chunk of Object.values(chunks))
			if (chunk)
				data += chunk;

		data = decompress(data, { inputEncoding: "StorageBinaryString" });

		return data;
	}
}
