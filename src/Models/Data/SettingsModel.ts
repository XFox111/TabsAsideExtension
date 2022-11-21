import { BehaviorMode, ViewMode } from "./SettingsTypes";

export default class SettingsModel
{
	public LoadOnRestore: boolean = true;
	public Behavior: BehaviorMode = "popup";
	public ShowDeleteDialog: boolean = true;
	public ViewMode: ViewMode = "grid";

	public constructor();
	public constructor(storageData: Record<string, any>);
	public constructor(storageData?: Record<string, any>)
	{
		if (!storageData)
			return;

		if (storageData.LoadOnRestore)
			this.LoadOnRestore = storageData.LoadOnRestore;

		if (storageData.Behavior)
			this.Behavior = storageData.Behavior;

		if (storageData.ShowDeleteDialog)
			this.ShowDeleteDialog = storageData.ShowDeleteDialog;

		if (storageData.ViewMode)
			this.ViewMode = storageData.ViewMode;
	}
}
