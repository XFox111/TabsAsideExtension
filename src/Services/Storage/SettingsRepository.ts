import { Storage } from "webextension-polyfill";
import SettingsModel from "../../Models/Data/SettingsModel";
import ext from "../../Utils/ext";

/**
 * Data repository that provides access to saved settings.
 */
export default class SettingsRepository
{
	/**
	 * Fired when settings are changed.
	 */
	public ItemsChanged: (changes: Partial<SettingsModel>) => void;

	public constructor()
	{
		ext?.storage.sync.onChanged.addListener(this.OnStorageChanged);
	}

	/**
	 * Gets saved settings.
	 * @returns Saved settings
	 */
	public async GetSettingsAsync(): Promise<SettingsModel>
	{
		let fallbackOptions = new SettingsModel();

		if (!ext)
			return fallbackOptions;

		let options: Record<string, any> = await ext.storage.sync.get(fallbackOptions);

		return new SettingsModel(options);
	}

	/**
	 * Saves settings.
	 * @param changes Changes to be saved
	 */
	public async UpdateSettingsAsync(changes: Partial<SettingsModel>): Promise<void>
	{
		if (ext)
			await ext.storage.sync.set(changes);
		else if (this.ItemsChanged)
			this.ItemsChanged(changes);
	}

	private OnStorageChanged(changes: Record<string, Storage.StorageChange>): void
	{
		let propsList: string[] = Object.keys(new SettingsRepository());
		let settings: Record<string, any> = {};

		Object.entries(changes)
			.filter(i => propsList.includes(i[0]))
			.map(i => settings[i[0]] = i[1].newValue);

		this.ItemsChanged?.(settings as Partial<SettingsModel>);
	}
}
