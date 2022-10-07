import { Label, tokens } from "@fluentui/react-components";
import React from "react";
import "./ProgressBar.scss";

export interface IProgressBarProps
{
	min?: number;
	max?: number;
	value?: number;
	foreground?: string;
	background?: string;
	warningPercentage?: number;
	label?: string;
	showPercentage?: boolean;
	secondaryText?: string;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

interface IStates
{
	progress: number;
	foregroundColor?: string;
}

export default class ProgressBar extends React.Component<IProgressBarProps, IStates>
{
	constructor(props: IProgressBarProps)
	{
		super(props);
		this.state =
		{
			progress: 0
		};
	}

	public componentDidUpdate(): void
	{
		let pr : IProgressBarProps =
		{
			min: 0,
			max: 100,
			value: 0,
			...this.props
		};

		let progress : number = pr.value / (pr.max - pr.min) * 100;

		if (progress < 0)
			progress = 0;
		else if (progress > 100)
			progress = 100;

		let foregroundColor : string =
			(pr.warningPercentage && progress > pr.warningPercentage) ?
				tokens.colorPaletteYellowBorderActive :
				pr.foreground;

		setTimeout(() => this.setState({ progress, foregroundColor }), 100);
	}

	public render() : JSX.Element
	{
		return (
			<div className="progress-bar" { ...this.props.containerProps }>
				{ this.props.label &&
					<Label weight="semibold">{ this.props.label }</Label>
				}
				<div className="progress-bar__bar" style={ { backgroundColor: this.props.background } }>
					<div className="progress-bar__fill" style={ { width: `${this.state.progress}%`, backgroundColor: this.state.foregroundColor } } />
				</div>
				<div className="secondary-labels">
					<Label size="small">{ this.props.secondaryText }</Label>
					<Label size="small" hidden={ !this.props.showPercentage }>{ `${this.state.progress.toFixed(0)}%` }</Label>
				</div>
			</div>
		);
	}
}
