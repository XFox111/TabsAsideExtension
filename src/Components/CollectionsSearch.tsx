import { Input, Menu, MenuTrigger, Tooltip, Button, MenuPopover, MenuList, MenuItemCheckbox, MenuItem, MenuDivider, MenuItemRadio } from "@fluentui/react-components";
import { SearchRegular, FilterRegular, CloudDismissRegular, GroupListRegular, ColorRegular, CircleRegular, CircleFilled, ArrowResetRegular, ArrowSortRegular, TextSortAscendingRegular, TextSortDescendingRegular, ClockRegular, HistoryRegular, GridRegular, StarEmphasisRegular } from "@fluentui/react-icons";
import React from "react";

export default class CollectionsSearch extends React.Component
{
	public render(): JSX.Element
	{
		return (
			<Input
				placeholder="Search"
				appearance="filled-lighter"
				contentBefore={ <SearchRegular /> }
				contentAfter={
					<>
						{ this.GetFilterButton() }
						{ this.GetSortButton() }
						<Tooltip content="View" relationship="label">
							<Button icon={ <GridRegular /> } appearance="subtle" />
						</Tooltip>
					</>
				} />
		);
	}

	private GetFilterButton(): JSX.Element
	{
		return (
			<Menu>
				<MenuTrigger>
					<Tooltip content="Filter" relationship="label">
						<Button appearance="subtle" icon={ <FilterRegular /> } />
					</Tooltip>
				</MenuTrigger>

				<MenuPopover>
					<MenuList>
						<MenuItemCheckbox name="filter" value="" icon={ <CloudDismissRegular /> }>Local &amp; sync issues</MenuItemCheckbox>
						<MenuItemCheckbox name="filter" value="" icon={ <GroupListRegular /> }>Nested groups</MenuItemCheckbox>
						<Menu>
							<MenuTrigger>
								<MenuItem icon={ <ColorRegular /> }>Color</MenuItem>
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
						<MenuDivider />
						<MenuItem icon={ <ArrowResetRegular /> }>Reset filters</MenuItem>
					</MenuList>
				</MenuPopover>
			</Menu>
		);
	}

	private GetSortButton(): JSX.Element
	{
		return (
			<Menu>
				<MenuTrigger>
					<Tooltip content="Sort" relationship="label">
						<Button appearance="subtle" icon={ <ArrowSortRegular /> } />
					</Tooltip>
				</MenuTrigger>

				<MenuPopover>
					<MenuList>
						<MenuItemRadio icon={ <StarEmphasisRegular /> } name="sort" value="relevant">Relevance</MenuItemRadio>
						<MenuItemRadio icon={ <TextSortAscendingRegular /> } name="sort" value="a2z">A to Z</MenuItemRadio>
						<MenuItemRadio icon={ <TextSortDescendingRegular /> } name="sort" value="z2a">Z to A</MenuItemRadio>
						<MenuItemRadio icon={ <ClockRegular /> } name="sort" value="newest">Newest first</MenuItemRadio>
						<MenuItemRadio icon={ <HistoryRegular /> } name="sort" value="oldest">Oldest first</MenuItemRadio>
					</MenuList>
				</MenuPopover>
			</Menu>
		);
	}
}
