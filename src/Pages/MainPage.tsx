import { Text } from "@fluentui/react-components";
import React from "react";
import "./MainPage.scss";

export default class MainPage extends React.Component
{
	public render(): JSX.Element
	{
		return (
			<main className="MainPage">
				<Text as="h1">MainPage.tsx</Text>
			</main>
		);
	}
}
