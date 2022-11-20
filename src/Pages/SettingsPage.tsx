import { Text } from "@fluentui/react-components";
import React from "react";
import "./SettingsPage.scss";

export default class SettingsPage extends React.Component
{
	public render(): JSX.Element
	{
		return (
			<main className="SettingsPage">
				<Text as="h1">SettingsPage.tsx</Text>
			</main>
		);
	}
}
