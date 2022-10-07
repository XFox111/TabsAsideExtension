import { Link, Text } from "@fluentui/react-components";
import { PinRegular } from "@fluentui/react-icons";
import React from "react";

import "./GroupView.scss";

export default class GroupView extends React.Component<React.PropsWithChildren>
{
	public render(): JSX.Element
	{
		return (
			<div className="GroupView stack gap pinned hoverHost">
				<header>
					<div>
						<PinRegular />
						<Text weight="semibold" size={ 200 }>Pinned</Text>
					</div>
					<Link as="a" className="hover">Open all</Link>
				</header>
				<div className="stack horizontal gap TabsCollection">
					{ this.props.children }
				</div>
			</div>
		);
	}
}
