import { Browser, Menus } from "webextension-polyfill";
import { SaveActions } from "../Models/Data/SettingsTypes";

const ext: Browser | null = (process.env.NODE_ENV !== "development") ? require("webextension-polyfill") : null;
export default ext;

export const parentContextMenuIds: string[] = [ "set-aside", "save-tabs" ];
export const chromiumOnlyOptions: string[] = [ SaveActions.SaveTabsGroup, SaveActions.SetAsideGroup ];

export const contextMenus: Menus.CreateCreatePropertiesType[] =
[
	{
		id: parentContextMenuIds[0],
		title: "Set tabs aside",
		contexts: [ "action" ]
	},
	{
		id: SaveActions.SetAsideAll,
		title: "All tabs",
		contexts: [ "action" ],
		parentId: parentContextMenuIds[0]
	},
	{
		id: SaveActions.SetAsideSelected,
		title: "Selected tabs",
		contexts: [ "action" ],
		parentId: parentContextMenuIds[0]
	},
	{
		id: SaveActions.SetAsideGroup,
		title: "Current group",
		contexts: [ "action" ],
		parentId: parentContextMenuIds[0]
	},

	{
		id: parentContextMenuIds[1],
		title: "Save tabs without closing",
		contexts: [ "action" ]
	},
	{
		id: SaveActions.SaveTabsAll,
		title: "All tabs",
		contexts: [ "action" ],
		parentId: parentContextMenuIds[1]
	},
	{
		id: SaveActions.SaveTabsSelected,
		title: "Selected tabs",
		contexts: [ "action" ],
		parentId: parentContextMenuIds[1]
	},
	{
		id: SaveActions.SaveTabsGroup,
		title: "Current group",
		contexts: [ "action" ],
		parentId: parentContextMenuIds[1]
	}
];
