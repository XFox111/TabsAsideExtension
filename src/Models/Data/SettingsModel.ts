import { ActionBehavior, BehaviorMode, GroupRestorePolicy, GroupingPolicy, RestoreAction, SaveActions, ViewMode } from "./SettingsTypes";

export default class SettingsModel
{
	public LoadOnRestore: boolean = true;
	public Behavior: BehaviorMode = "popup";
	public ShowDeleteDialog: boolean = true;
	public ViewMode: ViewMode = "grid";
	public ShowBadgeCounter: boolean = true;
	public IncludePinned: boolean = false;
	public GroupingPolicy: GroupingPolicy = "preserve";
	public ActionBehavior: ActionBehavior = "quckaciton";
	public DefaultSaveAction: SaveActions = SaveActions.SetAsideAll;
	public DefaultRestoreAction: RestoreAction = "restore";
	public GroupRestorePolicy: GroupRestorePolicy = "preserve";
	public EnableSearchPromos: boolean = false;

	public constructor();
	public constructor(storageData: Record<string, any>);
	public constructor(storageData?: Record<string, any>)
	{
		if (storageData === undefined)
			return;

		this.LoadOnRestore = storageData.LoadOnRestore;
		this.Behavior = storageData.Behavior;
		this.ShowDeleteDialog = storageData.ShowDeleteDialog;
		this.ViewMode = storageData.ViewMode;
		this.ShowBadgeCounter = storageData.ShowBadgeCounter;
		this.IncludePinned = storageData.IncludePinned;
		this.GroupingPolicy = storageData.GroupingPolicy;
		this.ActionBehavior = storageData.ActionBehavior;
		this.DefaultSaveAction = storageData.DefaultSaveAction;
		this.GroupRestorePolicy = storageData.GroupRestorePolicy;
		this.EnableSearchPromos = storageData.EnableSearchPromos;
	}
}
