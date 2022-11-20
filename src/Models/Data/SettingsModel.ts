export default class SettingsModel
{
	// Add new settings here.

	public constructor();
	public constructor(storageData: Record<string, any>);
	public constructor(storageData?: Record<string, any>)
	{
		if (!storageData)
			return;
		// TODO: Convert storageData to SettingsModel.
	}
}
