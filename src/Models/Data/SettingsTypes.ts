export type BehaviorMode = "popup" | "tab" | "contextmenu";
export type ViewMode = "list" | "grid";
export type GroupingPolicy = "separate" | "preserve" | "omit";
export type ActionBehavior = "quckaciton" | "contextmenu";

export enum SaveActions
{
	SetAsideAll = "set-aside-all",
	SetAsideSelected = "set-aside-selected",
	SetAsideGroup = "set-aside-group",

	SaveTabsAll = "save-tabs-all",
	SaveTabsSelected = "save-tabs-selected",
	SaveTabsGroup = "save-tabs-group"
}
