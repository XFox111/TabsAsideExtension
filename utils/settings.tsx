import { CollectionSortMode } from "@/entrypoints/sidepanel/utils/sortCollections";

export const settings = {
	defaultRestoreAction: storage.defineItem<"open" | "restore">(
		"sync:defaultRestoreAction",
		{
			fallback: "open",
			version: 1
		}
	),

	defaultSaveAction: storage.defineItem<"save" | "set_aside">(
		"sync:defaultSaveAction",
		{
			fallback: "set_aside",
			version: 1
		}
	),

	dismissOnLoad: storage.defineItem<boolean>(
		"sync:dismissOnLoad",
		{
			fallback: false,
			version: 1
		}
	),

	deletePrompt: storage.defineItem<boolean>(
		"sync:deletePrompt",
		{
			fallback: true,
			version: 1
		}
	),

	tilesView: storage.defineItem<boolean>(
		"sync:tilesView",
		{
			fallback: true,
			version: 1
		}
	),

	sortMode: storage.defineItem<CollectionSortMode>(
		"sync:sortMode",
		{
			fallback: "custom",
			version: 1
		}
	),

	ignorePinned: storage.defineItem<boolean>(
		"sync:ignorePinned",
		{
			fallback: true,
			version: 1
		}
	),

	alwaysShowToolbars: storage.defineItem<boolean>(
		"sync:alwaysShowToolbars",
		{
			fallback: false,
			version: 1
		}
	),

	showBadge: storage.defineItem<boolean>(
		"sync:showBadge",
		{
			fallback: true,
			version: 1
		}
	),

	contextAction: storage.defineItem<"action" | "context" | "open">(
		"sync:contextAction",
		{
			fallback: "open",
			version: 1
		}
	),

	listLocation: storage.defineItem<"sidebar" | "popup" | "tab" | "pinned">(
		"sync:listLocation",
		{
			fallback: "sidebar",
			version: 1
		}
	),

	notifyOnSave: storage.defineItem<boolean>(
		"sync:notifyOnSave",
		{
			fallback: true,
			version: 1
		}
	)
};
