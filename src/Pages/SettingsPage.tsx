import React from "react";
import * as Fluent from "@fluentui/react-components";
import { isFirefox } from "react-device-detect";

import GeneralSection from "./Settings/GeneralSection";
import BehaviorSection from "./Settings/BehaviorSection";
import ActionsSection from "./Settings/ActionsSection";
import GroupingSection from "./Settings/GroupingSection";
import StorageSection from "./Settings/StorageSection";
import AboutSection from "./Settings/AboutSection";

import SettingsRepository from "../Services/Storage/SettingsRepository";
import SettingsModel from "../Models/Data/SettingsModel";

import Package from "../../package.json";
import "./SettingsPage.scss";

interface IStates
{
	settings: SettingsModel;
}

export default class SettingsPage extends React.Component<any, IStates>
{
	private settingsRepo: SettingsRepository;

	constructor(props: any)
	{
		super(props);

		this.settingsRepo = new SettingsRepository();
		this.settingsRepo.ItemsChanged = changes => this.setState({ settings: { ...this.state.settings, ...changes } });

		this.state =
		{
			settings: new SettingsModel()
		};
	}

	public async componentDidMount(): Promise<void>
	{
		let settings = await this.settingsRepo.GetSettingsAsync();
		this.setState({ settings });
	}

	public render(): JSX.Element
	{
		return (
			<main className="SettingsPage stack">
				<header>
					<Fluent.Title2 as="h1">Settings | Tabs aside <sup><Fluent.Text>{ Package.version }</Fluent.Text></sup></Fluent.Title2>
				</header>
				<article>
					<Fluent.Accordion defaultOpenItems="about">
						<GeneralSection settings={ this.state.settings } settingsRepo={ this.settingsRepo } />
						<BehaviorSection settings={ this.state.settings } settingsRepo={ this.settingsRepo } />
						<ActionsSection settings={ this.state.settings } settingsRepo={ this.settingsRepo } />
						{ !isFirefox &&
							<GroupingSection settings={ this.state.settings } settingsRepo={ this.settingsRepo } />
						}
						<StorageSection settings={ this.state.settings } settingsRepo={ this.settingsRepo } />
						<AboutSection />
					</Fluent.Accordion>
				</article>
			</main>
		);
	}
}
