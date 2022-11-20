import { Browser, Storage } from "webextension-polyfill";
import { SettingsModel } from "../../Models/Data";
import { Event, ext } from "../../Utils";

export default class SettingsService
{
	private constructor() {}

	public static readonly Changed = new Event<Browser, Partial<SettingsModel>>();

	public static async GetSettings(): Promise<SettingsModel>
	{
		let fallbackOptions = new SettingsModel();

		if (!ext)
			return fallbackOptions;

		let options: Record<string, any> = await ext.storage.sync.get(fallbackOptions);

		if (!ext.storage.sync.onChanged.hasListener(SettingsService.OnStorageChanged))
			ext.storage.sync.onChanged.addListener(SettingsService.OnStorageChanged);

		return new SettingsModel(options);
	}

	public static async SetSettings(changes: Partial<SettingsModel>): Promise<void>
	{
		if (ext)
			await ext.storage.sync.set(changes);
		else
			SettingsService.Changed.Invoke(null, changes);
	}

	private static OnStorageChanged(changes: { [key: string]: Storage.StorageChange }): void
	{
		let propsList: string[] = Object.keys(new SettingsService());
		let settings: { [key: string]: any; } = {};

		Object.entries(changes)
			.filter(i => propsList.includes(i[0]))
			.map(i => settings[i[0]] = i[1].newValue);

		SettingsService.Changed.Invoke(ext, settings as Partial<SettingsModel>);
	}
}
