import React from "react";
import * as Fluent from "@fluentui/react-components";
import * as Icons from "@fluentui/react-icons";
import { Field } from "@fluentui/react-components/unstable";

import SettingsModel from "../../Models/Data/SettingsModel";
import SettingsRepository from "../../Services/Storage/SettingsRepository";
import { ActionBehavior, BehaviorMode } from "../../Models/Data/SettingsTypes";

import "./BehaviorSection.scss";

export default class BehaviorSection extends React.Component<{ settings: SettingsModel, settingsRepo: SettingsRepository; }>
{
	private behaviorOptions: Record<BehaviorMode, string> =
	{
		popup: "Popup",
		tab: "Tab + action",
		contextmenu: "Context menu"
	};

	private actionOptions: Record<ActionBehavior, string> =
	{
		quckaciton: "Quick actions",
		contextmenu: "Context menu"
	};

	public render(): JSX.Element
	{
		return (
			<Fluent.AccordionItem value="behavior" className="BehaviorSection">
				<Fluent.AccordionHeader icon={ <Icons.ArrowRoutingRectangleMultipleRegular /> }>
					<Fluent.Text as="h2" size={ 400 } weight="semibold">Behavior</Fluent.Text>
				</Fluent.AccordionHeader>

				<Fluent.AccordionPanel className="behaviorLayout">

					<div className="stack gap">
						<Field label="Extension behavior">
							<Fluent.Dropdown
								onOptionSelect={ (_, e) => this.props.settingsRepo.UpdateSettingsAsync({ Behavior: e.optionValue as BehaviorMode }) }
								selectedOptions={ [this.props.settings.Behavior] }
								value={ this.behaviorOptions[this.props.settings.Behavior] }>

								{ Object.entries(this.behaviorOptions).map(i =>
									<Fluent.Option key={ i[0] } value={ i[0] }>{ i[1] }</Fluent.Option>
								) }
							</Fluent.Dropdown>
						</Field>
						<Fluent.Checkbox
							disabled={ this.props.settings.Behavior !== "popup" }
							checked={ this.props.settings.ShowBadgeCounter }
							onChange={ (_, e) => this.props.settingsRepo.UpdateSettingsAsync({ ShowBadgeCounter: e.checked as boolean }) }
							label="Show badge counter" />
					</div>

					<div className="stack gap">
						<Fluent.Text as="p">
							<Fluent.Text weight="semibold">Popup</Fluent.Text><br />
							<Fluent.Text><Icons.AppsRegular /> Click extension icon to access saved collections</Fluent.Text>
						</Fluent.Text>
						<Fluent.Text as="p">
							<Fluent.Text weight="semibold">Tab + action</Fluent.Text><br />
							<Fluent.Text><Icons.WindowRegular /> Extension will pin a new browser tab with your saved collection</Fluent.Text><br />
							<Fluent.Text><Icons.AppsRegular /> Click extension icon to set tabs aside (default action)</Fluent.Text>
						</Fluent.Text>
						<Fluent.Text as="p">
							<Fluent.Text weight="semibold">Context menu</Fluent.Text><br />
							<Fluent.Text><Icons.AppsRegular /> Click extension icon to set tabs aside (default action)</Fluent.Text><br />
							<Fluent.Text><Icons.CursorClickRegular /> Right-click to open context menu and access your saved tabs</Fluent.Text><br />
							<Fluent.Text><Icons.ArrowRepeatAllRegular /> You can swap behaviors in the option below</Fluent.Text>
						</Fluent.Text>
					</div>

					<Fluent.Divider />

					<Field label="Extension icon behavior">
						<Fluent.Dropdown
							disabled={ this.props.settings.Behavior === "popup" }
							onOptionSelect={ (_, e) => this.props.settingsRepo.UpdateSettingsAsync({ ActionBehavior: e.optionValue as ActionBehavior }) }
							selectedOptions={ [ this.props.settings.ActionBehavior ] }
							value={ this.actionOptions[this.props.settings.ActionBehavior] }>

							{ Object.entries(this.actionOptions).map(i =>
								<Fluent.Option key={ i[0] } value={ i[0] }>{ i[1] }</Fluent.Option>
							) }
						</Fluent.Dropdown>
					</Field>

					<div className="stack gap">
						<Fluent.Text as="p">
							<Fluent.Text weight="semibold">Quick action</Fluent.Text><br />
							<Fluent.Text><Icons.ArrowRoutingRectangleMultipleRegular /> Click extension icon to perform default action</Fluent.Text><br />
							<Fluent.Text><Icons.AppsRegular /> Right-click extension icon to discover other options</Fluent.Text>
						</Fluent.Text>
						<Fluent.Text as="p">
							<Fluent.Text weight="semibold">Context menu</Fluent.Text><br />
							<Fluent.Text><Icons.CursorClickRegular /> Click extension icon to open context menu with all options</Fluent.Text>
						</Fluent.Text>
					</div>

				</Fluent.AccordionPanel>
			</Fluent.AccordionItem>
		);
	}
}
