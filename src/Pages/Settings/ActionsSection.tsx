import React from "react";
import * as Fluent from "@fluentui/react-components";
import * as Icons from "@fluentui/react-icons";
import { Field } from "@fluentui/react-components/unstable";
import { OpenShortcutsPage } from "../../Utils/ExtensionUtils";

import SettingsModel from "../../Models/Data/SettingsModel";
import SettingsRepository from "../../Services/Storage/SettingsRepository";
import { RestoreAction, SaveActions } from "../../Models/Data/SettingsTypes";
import { isFirefox } from "react-device-detect";

export default class ActionsSection extends React.Component<{ settings: SettingsModel, settingsRepo: SettingsRepository; }>
{
	private saveOptions: Record<SaveActions, string> =
	{
		"set-aside-all": "All tabs",
		"set-aside-selected": "Selected tabs",
		"set-aside-group": "Active group",
		"save-tabs-all": "All tabs",
		"save-tabs-selected": "Selected tabs",
		"save-tabs-group": "Active group"
	};

	private restoreOptions: Record<RestoreAction, string> =
	{
		restore: "Restore and remove",
		open: "Open without removing"
	}

	public render(): JSX.Element
	{
		return (
			<Fluent.AccordionItem value="actions" className="ActionsSection">
				<Fluent.AccordionHeader icon={ <Icons.CheckmarkCircleRegular /> }>
					<Fluent.Text as="h2" size={ 400 } weight="semibold">Default actions</Fluent.Text>
				</Fluent.AccordionHeader>

				<Fluent.AccordionPanel className="stack gap">

					<Field label="When saving tabs">
						<Fluent.Dropdown
							onOptionSelect={ (_, e) => this.props.settingsRepo.UpdateSettingsAsync({ DefaultSaveAction: e.optionValue as SaveActions }) }
							selectedOptions={ [ this.props.settings.DefaultSaveAction ] }
							value={ this.GetSaveDropdownValue() }>

							<Fluent.OptionGroup label="Save and close">
								{ Object.entries(this.saveOptions).filter(i => i[0].startsWith("set-aside") && (isFirefox ? !i[0].endsWith("group") : true)).map(i =>
									<Fluent.Option key={ i[0] } value={ i[0] }>{ i[1] }</Fluent.Option>
								) }
							</Fluent.OptionGroup>
							<Fluent.OptionGroup label="Save without closing">
								{ Object.entries(this.saveOptions).filter(i => i[0].startsWith("save-tabs") && (isFirefox ? !i[0].endsWith("group") : true)).map(i =>
									<Fluent.Option key={ i[0] } value={ i[0] }>{ i[1] }</Fluent.Option>
								) }
							</Fluent.OptionGroup>
						</Fluent.Dropdown>
					</Field>

					<Field label="When restoring tabs">
						<Fluent.Dropdown
							onOptionSelect={ (_, e) => this.props.settingsRepo.UpdateSettingsAsync({ DefaultRestoreAction: e.optionValue as RestoreAction }) }
							selectedOptions={ [ this.props.settings.DefaultRestoreAction ] }
							value={ this.restoreOptions[this.props.settings.DefaultRestoreAction] }>

							{ Object.entries(this.restoreOptions).map(i =>
								<Fluent.Option key={ i[0] } value={ i[0] }>{ i[1] }</Fluent.Option>
							) }
						</Fluent.Dropdown>
					</Field>

					<Fluent.Divider />

					<Fluent.Button
						icon={ <Icons.KeyCommandRegular /> }
						onClick={ () => OpenShortcutsPage() }>

						Change extension shortcuts
					</Fluent.Button>

				</Fluent.AccordionPanel>
			</Fluent.AccordionItem>
		);
	}

	private GetSaveDropdownValue(): string
	{
		return (this.props.settings.DefaultSaveAction.startsWith("set-aside") ? "Save and close" : "Save without closing") + " " + this.saveOptions[this.props.settings.DefaultSaveAction].toLocaleLowerCase();
	}
}
