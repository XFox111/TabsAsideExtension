export type BehaviorMode = "popup" | "tab" | "contextmenu";
export type ViewMode = "list" | "grid";
export type GroupingPolicy = "preserve" | "separate" | "omit";
export type ActionBehavior = "quckaciton" | "contextmenu";
export type RestoreAction = "restore" | "open";
export type GroupRestorePolicy = "preserve" | "join" | "omit";

export enum SaveActions
{
	SetAsideAll = "set-aside-all",
	SetAsideSelected = "set-aside-selected",
	SetAsideGroup = "set-aside-group",

	SaveTabsAll = "save-tabs-all",
	SaveTabsSelected = "save-tabs-selected",
	SaveTabsGroup = "save-tabs-group"
}
