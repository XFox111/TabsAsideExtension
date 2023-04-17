import IMigration from "./IMigration";
import CollectionModel from "../../Models/Data/CollectionModel";
import IGraphics from "../../Models/Data/IGraphics";
import SettingsModel from "../../Models/Data/SettingsModel";
import TabModel from "../../Models/Data/TabModel";
import * as Legacy from "../../Models/Data/Legacy/v1";
import ext from "../../Utils/ext";

export default class MigrationV1 implements IMigration
{
	public async RecoverGraphicsAsync(): Promise<Record<string, IGraphics>>
	{
		let legacyCollections: Legacy.CollectionModel[];

		try { legacyCollections = JSON.parse(localStorage.getItem(Legacy.CollectionModel.KEY)); }
		catch { return null; }

		if (!legacyCollections)
			return null;

		let graphics: Record<string, IGraphics> = {};

		for (let collection of legacyCollections)
		{
			if (!collection.thumbnails)
				continue;

			for (let i = 0; i < collection.links.length; i++)
			{
				let url: string = collection.links[i];

				let graphicsItem: IGraphics = { };

				if (collection.icons[i])
					graphicsItem.Icon = collection.icons[i];

				if (collection.thumbnails[i])
					graphicsItem.Thumbnail = collection.thumbnails[i];

				if (Object.keys(graphicsItem).length > 0)
					graphics[url] = graphicsItem;
			}
		}

		return graphics;
	}

	public async RecoverCollectionsAsync(): Promise<CollectionModel[]>
	{
		let legacyCollections: Legacy.CollectionModel[];

		try { legacyCollections = JSON.parse(localStorage.getItem(Legacy.CollectionModel.KEY)); }
		catch { return null; }

		if (!legacyCollections)
			return null;

		let collections: CollectionModel[] = [];

		for (let legacyCollection of legacyCollections)
		{
			let collection: CollectionModel = new CollectionModel();

			collection.Timestamp = legacyCollection.timestamp;

			if (legacyCollection.name)
				collection.Title = legacyCollection.name;

			collection.Items = legacyCollection.links.map((url: string, index: number) =>
			{
				let tab: TabModel = new TabModel(url);

				let title: string = legacyCollection.titles[index];

				if (title)
					try { new URL(title); }
					catch { tab.Title = title; }	// If title is not a valid URL, then it's a title

				return tab;
			});

			collections.push(collection);
		}

		return collections;
	}

	public async RecoverSettingsAsync(): Promise<SettingsModel>
	{
		if (!ext)
			return null;

		let legacySettings: Partial<Legacy.SettingsModel> = await ext.storage.sync.get(new Legacy.SettingsModel());
		let settings: SettingsModel = new SettingsModel();

		if (legacySettings.loadOnRestore === false)
			settings.LoadOnRestore = false;

		if (legacySettings.showDeleteDialog === false)
			settings.ShowDeleteDialog = false;

		return settings;
	}
}
