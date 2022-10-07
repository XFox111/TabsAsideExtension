import { Text, Tooltip, Button, Divider, Menu, MenuTrigger, MenuButtonProps, SplitButton, MenuPopover, MenuList, MenuItem, tokens } from "@fluentui/react-components";
import { Alert } from "@fluentui/react-components/unstable";
import { SettingsRegular, QuestionCircleRegular, ArrowRightRegular, SelectAllOffRegular, GroupListRegular, WindowArrowUpRegular, CollectionsAddRegular, AddRegular, Collections24Regular, HeartFilled } from "@fluentui/react-icons";
import React from "react";
import CollectionEditDialog from "../Components/CollectionEditDialog";
import CollectionsSearch from "../Components/CollectionsSearch";
import CollectionView from "../Components/CollectionView";
import "./MainView.scss";

export default class MainView extends React.Component
{
	public render(): JSX.Element
	{
		return (
			<main className="MainView">
				<header>
					<Text size={ 500 }>Tabs aside</Text>

					<nav>
						<Tooltip content="Settings" relationship="label">
							<Button as="a" href="/options.html" target="_blank" appearance="subtle" icon={ <SettingsRegular /> } />
						</Tooltip>

						<Tooltip content="Help &amp; FAQ" relationship="label">
							<Button as="a" href="#/faq" appearance="subtle" icon={ <QuestionCircleRegular /> } />
						</Tooltip>
					</nav>

					<Menu>
						<MenuTrigger>
							{ (triggerProps: MenuButtonProps) => (
								<SplitButton
									menuButton={ triggerProps }
									icon={ <ArrowRightRegular /> }
									appearance="transparent">

									Set all tabs aside
								</SplitButton>
							) }
						</MenuTrigger>

						<MenuPopover>
							<MenuList>
								<MenuItem icon={ <SelectAllOffRegular /> }>Set selected tabs aside</MenuItem>
								<MenuItem icon={ <GroupListRegular /> }>Set current group aside</MenuItem>
								<MenuItem icon={ <WindowArrowUpRegular /> }>Set current tab aside</MenuItem>
							</MenuList>
						</MenuPopover>
					</Menu>

					<nav>
						<Tooltip content="Create new collection" relationship="label">
							<Button icon={ <CollectionsAddRegular /> } appearance="transparent" />
						</Tooltip>
					</nav>
				</header>

				<Divider />

				{/* <div className="stack emptyPlaceholder">
					<Collections24Regular style={ { width: 72, height: 72 } } />
					<Text as="p">
						<Text weight="semibold" size={ 500 }>You have no saved tabs right now</Text><br />
						<Text><ArrowRightRegular/> Set your current tabs aside or <AddRegular/> create a new collection</Text>
					</Text>
					<Button appearance="primary" icon={ <AddRegular /> }>Create collection</Button>
				</div> */}
				<article>
					<nav>
						<CollectionsSearch />
					</nav>

					<Alert
						className="donationCta"
						intent="info"
						icon={ <HeartFilled color={ tokens.colorPaletteRedBorderActive } /> }
						action="Buy me a coffee">

						<Text>
							<Text weight="semibold">Like the extension?</Text><br />
							Support me with a donation. Even small amount is a big deal!
						</Text>
					</Alert>

					<CollectionView />
					<CollectionView />
					<CollectionView />
					<CollectionView />
					<CollectionView />
					<CollectionView />
					<CollectionView />
					<CollectionView />
					<CollectionView />
				</article>
			</main>
		);
	}
}
