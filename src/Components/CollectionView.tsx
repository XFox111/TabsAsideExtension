import React from "react";
import { Button, Menu, MenuButtonProps, MenuItem, MenuList, MenuPopover, MenuTrigger, SplitButton, Text, tokens } from "@fluentui/react-components";

import "./CollectionView.scss";
import "./CollectionView.List.scss";
import TabView from "./TabView";
import GroupView from "./GroupView";
import { AddRegular, ArrowExportRtlRegular, CloudRegular, DeleteRegular, EditRegular, MoreHorizontalRegular, OpenRegular, StorageRegular, TabInPrivateRegular, WindowNewRegular } from "@fluentui/react-icons";
import CollectionEditDialog from "./CollectionEditDialog";
import { Dialog, DialogActions, DialogBody, DialogSurface, DialogTitle } from "@fluentui/react-components/unstable";

export default class CollectionView extends React.Component
{
	public render(): JSX.Element
	{
		return (
			<section className="CollectionView stack ListView hoverHost">
				<header>
					<div className="stack">
						<Text weight="semibold" size={ 400 } className="CollectionTitle">EasyLogon</Text>
						<Text size={ 200 }>3 items</Text>
					</div>
					<div className="stack horizontal gap actions hover">
						<Menu>
							<MenuTrigger>
								{ (triggerProps: MenuButtonProps) => (
									<SplitButton menuButton={triggerProps} appearance="subtle" icon={ <ArrowExportRtlRegular /> }>
										Restore all
									</SplitButton>
								) }
							</MenuTrigger>

							<MenuPopover>
								<MenuList>
									<MenuItem icon={ <OpenRegular /> }>Open all</MenuItem>
									<MenuItem icon={ <WindowNewRegular /> }>Open all in new window</MenuItem>
									<MenuItem icon={ <TabInPrivateRegular /> }>Open all in new InPrivate window</MenuItem>
								</MenuList>
							</MenuPopover>
						</Menu>
						<Menu>
							<MenuTrigger>
								<Button appearance="subtle" icon={ <MoreHorizontalRegular /> } />
							</MenuTrigger>

							<MenuPopover>
								<MenuList>
									<MenuItem icon={ <AddRegular /> }>Add current tab</MenuItem>
									<MenuItem icon={ <CloudRegular /> }>Save to the cloud</MenuItem>
									<MenuItem icon={ <StorageRegular /> }>Move to local storage</MenuItem>
									<MenuItem icon={ <EditRegular /> }>Edit collection</MenuItem>
									<MenuItem
										style={ { color: tokens.colorPaletteRedForeground1 } }
										icon={ <DeleteRegular color={ tokens.colorPaletteRedForeground1 } /> }>

										Delete collection
									</MenuItem>
								</MenuList>
							</MenuPopover>
						</Menu>
					</div>
				</header>
				<div className="TabsCollection">
					<GroupView>
						<TabView />
						<TabView />
					</GroupView>
					<TabView />
					<TabView />
					<TabView />
					<TabView />
				</div>
				<Dialog>
					<DialogSurface>
						<DialogTitle>Delete collection</DialogTitle>
						<DialogBody>Are you sure you want to delete this collection? This action cannot be undone</DialogBody>
						<DialogActions>
							<Button>Delete</Button>
							<Button appearance="primary">Cancel</Button>
						</DialogActions>
					</DialogSurface>
				</Dialog>
				<CollectionEditDialog />
			</section>
		);
	}
}
