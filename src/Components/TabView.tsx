import React from "react";
import { Button, Text, Tooltip } from "@fluentui/react-components";

import { ReactComponent as PagePlaceholder } from "../Assets/PagePlaceholder.svg";
import { DismissRegular, GlobeRegular } from "@fluentui/react-icons";

import "./TabView.scss";

export default class TabView extends React.Component
{
	public render(): JSX.Element
	{
		return (
			<div className="TabView hoverHost">
				<PagePlaceholder className="PagePlaceholder" />
				<header>
					<GlobeRegular className="IconPlaceholder" />
					<Tooltip content="Home - FluentUI" relationship="description">
						<Text size={ 200 } truncate>Home - FluentUI</Text>
					</Tooltip>
					<Tooltip content="Delete tab" relationship="label">
						<Button icon={ <DismissRegular /> } appearance="subtle" className="DeleteBtn hover" />
					</Tooltip>
				</header>
			</div>
		);
	}
}
