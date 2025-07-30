import useSettings, { SettingsValue } from "@/hooks/useSettings";
import { Dropdown, Field, Option } from "@fluentui/react-components";

export default function ActionsSection(): React.ReactElement
{
	const [saveAction, setSaveAction] = useSettings("defaultSaveAction");
	const [restoreAction, setRestoreAction] = useSettings("defaultRestoreAction");

	return (
		<>
			<Field label={ i18n.t("options_page.actions.options.save_actions.title") }>
				<Dropdown
					value={ saveAction ? saveActionOptions[saveAction] : "" }
					selectedOptions={ [saveAction ?? ""] }
					onOptionSelect={ (_, e) => setSaveAction(e.optionValue as SaveActionType) }
				>
					{ Object.entries(saveActionOptions).map(([value, label]) =>
						<Option key={ value } value={ value }>
							{ label }
						</Option>
					) }
				</Dropdown>
			</Field>

			<Field label={ i18n.t("options_page.actions.options.restore_actions.title") }>
				<Dropdown
					value={ restoreAction ? restoreActionOptions[restoreAction] : "" }
					selectedOptions={ [restoreAction ?? ""] }
					onOptionSelect={ (_, e) => setRestoreAction(e.optionValue as RestoreActionType) }
				>
					{ Object.entries(restoreActionOptions).map(([value, label]) =>
						<Option key={ value } value={ value }>
							{ label }
						</Option>
					) }
				</Dropdown>
			</Field>
		</>
	);
}

type SaveActionType = SettingsValue<"defaultSaveAction">;
type RestoreActionType = SettingsValue<"defaultRestoreAction">;

const restoreActionOptions: Record<RestoreActionType, string> =
{
	"open": i18n.t("options_page.actions.options.restore_actions.options.open"),
	"restore": i18n.t("options_page.actions.options.restore_actions.options.restore")
};

const saveActionOptions: Record<SaveActionType, string> =
{
	"set_aside": i18n.t("options_page.actions.options.save_actions.options.set_aside"),
	"save": i18n.t("options_page.actions.options.save_actions.options.save")
};
