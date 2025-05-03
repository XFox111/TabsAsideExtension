import { CollectionSortMode } from "@/entrypoints/sidepanel/utils/sortCollections";
import { Button, Menu, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, Tooltip } from "@fluentui/react-components";
import * as ic from "@fluentui/react-icons";

export default function SortCollectionsButton({ value, onChange }: SortCollectionsButtonProps): React.ReactElement
{
	const ColorSortIcon = ic.bundleIcon(ic.ArrowSort20Filled, ic.ArrowSort20Regular);

	return (
		<Menu
			checkedValues={ { sort: value ? [value] : [] } }
			onCheckedValueChange={ (_, e) => onChange?.(e.checkedItems[0] as CollectionSortMode) }
		>
			<Tooltip relationship="label" content={ i18n.t("main.list.searchbar.sort.title") }>
				<MenuTrigger disableButtonEnhancement>
					<Button appearance="subtle" icon={ <ColorSortIcon /> } />
				</MenuTrigger>
			</Tooltip>

			<MenuPopover>
				<MenuList>
					{ Object.entries(sortIcons).map(([key, Icon]) =>
						<MenuItemRadio key={ key } name="sort" value={ key } icon={ <Icon /> }>
							{ i18n.t(`main.list.searchbar.sort.options.${key as CollectionSortMode}`) }
						</MenuItemRadio>
					) }
				</MenuList>
			</MenuPopover>
		</Menu>
	);
}

export type SortCollectionsButtonProps =
	{
		value?: CollectionSortMode | null;
		onChange?: (value: CollectionSortMode) => void;
	};

const sortIcons: Record<CollectionSortMode, ic.FluentIcon> =
{
	newest: ic.bundleIcon(ic.Sparkle20Filled, ic.Sparkle20Regular),
	oldest: ic.bundleIcon(ic.History20Filled, ic.History20Regular),
	ascending: ic.bundleIcon(ic.TextSortAscending20Filled, ic.TextSortAscending20Regular),
	descending: ic.bundleIcon(ic.TextSortDescending20Filled, ic.TextSortDescending20Regular),
	custom: ic.bundleIcon(ic.Star20Filled, ic.Star20Regular)
};
