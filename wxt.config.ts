import { ConfigEnv, defineConfig, UserManifest } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react", "@wxt-dev/i18n/module"],
	vite: () => ({
		build:
		{
			chunkSizeWarningLimit: 1000
		}
	}),
	imports: {
		dirsScanOptions:
		{
			// Disable auto-imports for project's files
			fileFilter: () => false
		}
	},

	manifest: ({ browser }: ConfigEnv) =>
	{
		const manifest: UserManifest = {
			name: "__MSG_manifest_name__",
			description: "__MSG_manifest_description__",
			homepage_url: "https://github.com/xfox111/TabsAsideExtension/",

			action:
			{
				default_title: "__MSG_manifest_name__"
			},

			default_locale: "en",
			permissions:
				[
					"storage",
					"unlimitedStorage",
					"tabs",
					"notifications",
					"contextMenus",
					"tabGroups"
				],

			optional_permissions:
				[
					"bookmarks"
				],

			commands:
			{
				show_collections:
				{
					suggested_key:
					{
						default: "Alt+P",
						mac: "MacCtrl+P"
					},
					description: "__MSG_shortcuts_toggle_sidebar__"
				},
				set_aside: {
					suggested_key:
					{
						default: "Alt+T",
						mac: "MacCtrl+T"
					},
					description: "__MSG_shortcuts_set_aside__"
				},
				save:
				{
					suggested_key:
					{
						default: "Alt+U",
						mac: "MacCtrl+U"
					},
					description: "__MSG_shortcuts_save_tabs__"
				}
			},

			host_permissions: ["<all_urls>"]
		};

		if (browser === "firefox")
		{
			manifest.browser_specific_settings = {
				gecko:
				{
					id: "tabsaside@xfox111.net",
					strict_min_version: "139.0",

					// @ts-expect-error Introduced in Firefox 139
					data_collection_permissions: {
						optional: ["technicalAndInteraction"]
					}
				}
			};

			// @ts-expect-error author key in Firefox has a different format
			manifest.author = "__MSG_manifest_author__";
		}

		return manifest;
	}
});
