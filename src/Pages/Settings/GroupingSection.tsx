import React from "react";
import * as Fluent from "@fluentui/react-components";
import * as Icons from "@fluentui/react-icons";
import { Field } from "@fluentui/react-components/unstable";

import SettingsRepository from "../../Services/Storage/SettingsRepository";
import SettingsModel from "../../Models/Data/SettingsModel";
import { GroupRestorePolicy, GroupingPolicy } from "../../Models/Data/SettingsTypes";

export default class GroupingSection extends React.Component<{ settings: SettingsModel, settingsRepo: SettingsRepository }>
{
	private saveOptions: Record<GroupingPolicy, string> =
	{
		preserve: "Preserve grouping inside one collection",
		separate: "Save each group in a separate collection",
		omit: "Omit grouping"
	};

	private restoreOptions: Record<GroupRestorePolicy, string> =
	{
		preserve: "Preserve grouping if possible",
		join: "Restore as one group",
		omit: "Omit grouping"
	};

	public render(): JSX.Element
	{
		return (
			<Fluent.AccordionItem value="grouping" className="GroupingSection">
				<Fluent.AccordionHeader icon={ <Icons.GroupRegular /> }>
					<Fluent.Text as="h2" size={ 400 } weight="semibold">Grouping</Fluent.Text>
				</Fluent.AccordionHeader>

				<Fluent.AccordionPanel className="stack gap">

					<Field label="When saving all tabs">
						<Fluent.Dropdown
							selectedOptions={ [ this.props.settings.GroupingPolicy ] }
							value={ this.saveOptions[this.props.settings.GroupingPolicy] }
							onOptionSelect={ (_, e) => this.props.settingsRepo.UpdateSettingsAsync({ GroupingPolicy: e.optionValue as GroupingPolicy }) }>

							{ Object.entries(this.saveOptions).map(i =>
								<Fluent.Option key={ i[0] } value={ i[0] }>{ i[1] }</Fluent.Option>
							)}
						</Fluent.Dropdown>
					</Field>

					<Field
						label="When restoring collections with groups"
						hint={
							this.props.settings.GroupRestorePolicy === "preserve" ?
								"If collection doesn't contain groups, it will be restored as one group" : ""
						}>

						<Fluent.Dropdown
							selectedOptions={ [ this.props.settings.GroupRestorePolicy ] }
							value={ this.restoreOptions[this.props.settings.GroupRestorePolicy] }
							onOptionSelect={ (_, e) => this.props.settingsRepo.UpdateSettingsAsync({ GroupRestorePolicy: e.optionValue as GroupRestorePolicy }) }>

							{ Object.entries(this.restoreOptions).map(i =>
								<Fluent.Option key={ i[0] } value={ i[0] }>{ i[1] }</Fluent.Option>
							)}
						</Fluent.Dropdown>
					</Field>

				</Fluent.AccordionPanel>
			</Fluent.AccordionItem>
		);
	}
}
