import { CollectionModel, SettingsModel, IGraphics, TabModel } from "../../Models/Data";
import { SettingsModel as LegacySettings, CollectionModel as LegacyCollection } from "../../Models/Data/Legacy/v2";
import GraphicsModel from "../../Models/Data/Legacy/v2/GraphicsModel";
import { ext } from "../../Utils";
import IMigration from "./IMigration";

export default class MigrationV2 implements IMigration
{
	public async RecoverCollectionsAsync(): Promise<CollectionModel[]>
	{
		if (!ext)
			return null;

		let legacyCollections: Record<string, LegacyCollection> = await this.GetLegacyCollectionsAsync();

		let collections: CollectionModel[] = [];

		for (let key in legacyCollections)
		{
			let collection: CollectionModel = new CollectionModel();

			collection.Timestamp = legacyCollections[key].timestamp ?? parseInt(key.replace(LegacyCollection.PREFIX, ""));

			if (legacyCollections[key].name)
				collection.Title = legacyCollections[key].name;

			for (let i = 0; i < legacyCollections[key].links.length; i++)
			{
				let tab: TabModel = new TabModel(legacyCollections[key].links[i]);

				if (legacyCollections[key].titles[i])
					tab.Title = legacyCollections[key].titles[i];

				collection.Items.push(tab);
			}

			collections.push(collection);
		}

		return collections;
	}

	public async RecoverSettingsAsync(): Promise<SettingsModel>
	{
		if (!ext)
			return null;

		let legacySettings: Partial<LegacySettings> = await ext.storage.sync.get(new LegacySettings());
		let settings: SettingsModel = new SettingsModel();

		if (legacySettings.loadOnRestore === false)
			settings.LoadOnRestore = false;

		if (legacySettings.showDeleteDialog === false)
			settings.ShowDeleteDialog = false;

		if (legacySettings.listview === true)
			settings.ViewMode = "list";

		return settings;
	}

	public async RecoverGraphicsAsync(): Promise<Record<string, IGraphics>>
	{
		if (!ext)
			return null;

		let legacyGraphics: Record<string, GraphicsModel> = await ext.storage.sync.get(null);
		let graphics: Record<string, IGraphics> = {};

		for (let key in legacyGraphics)
		{
			try { new URL(key) }
			catch { continue; }

			let graphic: IGraphics = { };

			if (legacyGraphics[key].iconUrl)
				graphic.Icon = legacyGraphics[key].iconUrl;

			if (legacyGraphics[key].pageCapture)
				graphic.Thumbnail = legacyGraphics[key].pageCapture;

			if (Object.keys(graphic).length > 0)
				graphics[key] = graphic;
		}

		return graphics;
	}

	private async GetLegacyCollectionsAsync(): Promise<Record<string, LegacyCollection>>
	{
		if (!ext)
			return null;

		let legacyCollections: Record<string, any> = await ext.storage.sync.get(null);

		for (let key in legacyCollections)
			if (!key.startsWith(LegacyCollection.PREFIX))
				delete legacyCollections[key]

		return legacyCollections;
	}
}
