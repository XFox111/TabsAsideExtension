import { FluentProvider, Theme, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import React from "react";

import "./App.scss";

// chrome.storage.local - 5 MiB
// chrome.storage.sync - 100 KiB

// 1024 * 5 = 5120 KiB
// 5120 + 100 = 5220 KiB
// 100 / 5220 = 1.9%

interface IStates
{
	theme: Theme;
}

export default class App extends React.Component<React.PropsWithChildren, IStates>
{
	constructor(props: any)
	{
		super(props);

		this.state =
		{
			theme: this.UpdateTheme(window.matchMedia("(prefers-color-scheme: dark)").matches)
		};
	}

	public componentDidMount(): void
	{
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change",
				(arg: MediaQueryListEvent) =>
					this.setState({ theme: this.UpdateTheme(arg.matches) })
			);
	}

	private UpdateTheme(isDark: boolean): Theme
	{
		let theme: Theme = isDark ? webDarkTheme : webLightTheme;
		document.body.style.backgroundColor = theme.colorNeutralBackground1;

		return theme;
	}

	public render(): JSX.Element
	{
		return (
			<div className="App">
				<FluentProvider theme={ this.state.theme }>
					{ this.props.children }
				</FluentProvider>
			</div>
		);
	}
}
