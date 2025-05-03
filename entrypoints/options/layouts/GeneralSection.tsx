import useSettings, { SettingsValue } from "@/hooks/useSettings";
import { Button, Checkbox, Dropdown, Field, Option, OptionOnSelectData } from "@fluentui/react-components";
import { KeyCommand20Regular } from "@fluentui/react-icons";
import { useOptionsStyles } from "../hooks/useOptionsStyles";

export default function GeneralSection(): React.ReactElement
{
	const [alwaysShowToolbars, setAlwaysShowToolbars] = useSettings("alwaysShowToolbars");
	const [ignorePinned, setIgnorePinned] = useSettings("ignorePinned");
	const [deletePrompt, setDeletePrompt] = useSettings("deletePrompt");
	const [showBadge, setShowBadge] = useSettings("showBadge");
	const [notifyOnSave, setNotifyOnSave] = useSettings("notifyOnSave");
	const [dismissOnLoad, setDismissOnLoad] = useSettings("dismissOnLoad");
	const [listLocation, setListLocation] = useSettings("listLocation");
	const [contextAction, setContextAction] = useSettings("contextAction");

	const cls = useOptionsStyles();

	const openShortcutsPage = (): Promise<any> =>
		browser.tabs.create({
			url: "chrome://extensions/shortcuts",
			active: true
		});

	const handleListLocationChange = (_: any, e: OptionOnSelectData): void =>
	{
		if (e.optionValue === "popup" && contextAction !== "open")
			setContextAction("open");

		setListLocation(e.optionValue as ListLocationType);
	};

	return (
		<>
			<section className={ cls.section }>
				<Checkbox
					label={ i18n.t("options_page.general.options.always_show_toolbars") }
					checked={ alwaysShowToolbars ?? false }
					onChange={ (_, e) => setAlwaysShowToolbars(e.checked as boolean) } />
				<Checkbox
					label={ i18n.t("options_page.general.options.include_pinned") }
					checked={ !ignorePinned }
					onChange={ (_, e) => setIgnorePinned(!e.checked) } />
				<Checkbox
					label={ i18n.t("options_page.general.options.show_delete_prompt") }
					checked={ deletePrompt ?? false }
					onChange={ (_, e) => setDeletePrompt(e.checked as boolean) } />
				<Checkbox
					label={ i18n.t("options_page.general.options.show_badge") }
					checked={ showBadge ?? false }
					onChange={ (_, e) => setShowBadge(e.checked as boolean) } />
				<Checkbox
					label={ i18n.t("options_page.general.options.show_notification") }
					checked={ notifyOnSave ?? false }
					onChange={ (_, e) => setNotifyOnSave(e.checked as boolean) } />
				<Checkbox
					label={ i18n.t("options_page.general.options.unload_tabs") }
					checked={ dismissOnLoad ?? false }
					onChange={ (_, e) => setDismissOnLoad(e.checked as boolean) } />
			</section>

			<Field label={ i18n.t("options_page.general.options.list_locations.title") }>
				<Dropdown
					value={ listLocation ? listLocationOptions[listLocation] : "" }
					selectedOptions={ [listLocation ?? ""] }
					onOptionSelect={ handleListLocationChange }
				>
					{ Object.entries(listLocationOptions).map(([key, value]) =>
						<Option key={ key } value={ key }>
							{ value }
						</Option>
					) }
				</Dropdown>
			</Field>

			<Field label={ i18n.t("options_page.general.options.icon_action.title") }>
				<Dropdown
					value={ contextAction ? contextActionOptions[contextAction] : "" }
					selectedOptions={ [contextAction ?? ""] }
					onOptionSelect={ (_, e) => setContextAction(e.optionValue as ContextActionType) }
					disabled={ listLocation === "popup" }
				>
					{ Object.entries(contextActionOptions).map(([key, value]) =>
						key === "context" && import.meta.env.FIREFOX
							? <></> :
							<Option key={ key } value={ key }>
								{ value }
							</Option>
					) }
				</Dropdown>
			</Field>

			{ !import.meta.env.FIREFOX &&
				<Button icon={ <KeyCommand20Regular /> } onClick={ openShortcutsPage } className={ cls.buttonFix }>
					{ i18n.t("options_page.general.options.change_shortcuts") }
				</Button>
			}
		</>
	);
}

type ListLocationType = SettingsValue<"listLocation">;
type ContextActionType = SettingsValue<"contextAction">;

const listLocationOptions: Record<ListLocationType, string> =
{
	"sidebar": i18n.t("options_page.general.options.list_locations.options.sidebar"),
	"popup": i18n.t("options_page.general.options.list_locations.options.popup"),
	"tab": i18n.t("options_page.general.options.list_locations.options.tab"),
	"pinned": i18n.t("options_page.general.options.list_locations.options.pinned")
};

const contextActionOptions: Record<ContextActionType, string> =
{
	"action": i18n.t("options_page.general.options.icon_action.options.action"),
	"context": i18n.t("options_page.general.options.icon_action.options.context"),
	"open": i18n.t("options_page.general.options.icon_action.options.open")
};
