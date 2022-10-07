import React from "react";

import { Dialog, DialogActions, DialogBody, DialogSurface, DialogTitle, DialogTrigger } from "@fluentui/react-components/unstable";
import { Button, Input, Label, Menu, MenuItemCheckbox, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";
import { CircleFilled, CircleRegular } from "@fluentui/react-icons";

export default class CollectionEditDialog extends React.Component
{
	public render(): JSX.Element
	{
		return (
			<Dialog>
				<DialogSurface>
					<DialogTitle>Edit collection</DialogTitle>
					<DialogBody className="stack gap">
						<Label id="label-CollectionName">Collection name</Label>
						<Input aria-labelledby="label-CollectionName" placeholder="Default: 29-Sep-22" />
						<Label id="label-CollectionColor">Collection color</Label>
						<Menu positioning="after">
							<MenuTrigger>
								<Button
									aria-labelledby="label-CollectionColor"
									icon={ <CircleFilled color="red" /> }
									style={ { width: "min-content" } }>Red</Button>
							</MenuTrigger>

							<MenuPopover>
								<MenuList>
									<MenuItemCheckbox icon={ <CircleRegular /> } name="color" value="unset">No color</MenuItemCheckbox>
									<MenuItemCheckbox icon={ <CircleFilled color="blue" /> } name="color" value="blue">Blue</MenuItemCheckbox>
									<MenuItemCheckbox icon={ <CircleFilled color="red" /> } name="color" value="red">Red</MenuItemCheckbox>
									<MenuItemCheckbox icon={ <CircleFilled color="orange" /> } name="color" value="orange">Orange</MenuItemCheckbox>
									<MenuItemCheckbox icon={ <CircleFilled color="green" /> } name="color" value="green">Green</MenuItemCheckbox>
									<MenuItemCheckbox icon={ <CircleFilled color="pink" /> } name="color" value="pink">Pink</MenuItemCheckbox>
									<MenuItemCheckbox icon={ <CircleFilled color="purple" /> } name="color" value="purple">Purple</MenuItemCheckbox>
									<MenuItemCheckbox icon={ <CircleFilled color="teal" /> } name="color" value="teal">Teal</MenuItemCheckbox>
									<MenuItemCheckbox icon={ <CircleFilled color="gray" /> } name="color" value="gray">Gray</MenuItemCheckbox>
								</MenuList>
							</MenuPopover>
						</Menu>
					</DialogBody>
					<DialogActions>
						<DialogTrigger>
							<Button appearance="secondary">Close</Button>
						</DialogTrigger>
						<Button appearance="primary">Save</Button>
					</DialogActions>
				</DialogSurface>
			</Dialog>
		);
	}
}
