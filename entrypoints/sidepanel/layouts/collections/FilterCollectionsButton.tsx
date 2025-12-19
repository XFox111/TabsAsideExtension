import { useGroupColors } from "@/hooks/useGroupColors";
import * as fui from "@fluentui/react-components";
import * as ic from "@fluentui/react-icons";
import { CollectionFilterType } from "../../utils/filterCollections";

export default function FilterCollectionsButton({ value, onChange, showHidden }: FilterCollectionsButtonProps): React.ReactElement
{
	const cls = useStyles();
	const colorCls = useGroupColors();

	const FilterIcon = ic.bundleIcon(ic.Filter20Filled, ic.Filter20Regular);
	const ColorIcon = ic.bundleIcon(ic.Circle20Filled, ic.CircleHalfFill20Regular);
	const NoColorIcon = ic.bundleIcon(ic.CircleOffFilled, ic.CircleOffRegular);
	const AnyColorIcon = ic.bundleIcon(ic.PhotoFilter20Filled, ic.PhotoFilter20Regular);
	const HiddenIcon = ic.bundleIcon(ic.EyeOff20Filled, ic.EyeOff20Regular);

	const values: Record<string, string[]> = useMemo(() => ({
		default: !value || value.length < 1 ? ["any"] : [],
		colors: value || [],
		hidden: showHidden ? ["show"] : []
	}), [value, showHidden]);

	const onCheckedValueChange = useCallback((_: fui.MenuCheckedValueChangeEvent, e: fui.MenuCheckedValueChangeData) =>
	{
		console.log(e, e.checkedItems.includes("show"));
		if (e.name === "hidden")
			onChange?.(value ?? [], e.checkedItems.includes("show"));
		else
			onChange?.(e.checkedItems.includes("any") ? [] : e.checkedItems as CollectionFilterType["colors"], showHidden ?? false);
	}, [onChange, showHidden]);

	return (
		<fui.Menu
			checkedValues={ values }
			onCheckedValueChange={ onCheckedValueChange }
		>

			<fui.Tooltip relationship="label" content={ i18n.t("main.list.searchbar.filter") }>
				<fui.MenuTrigger disableButtonEnhancement>
					<fui.Button appearance="subtle" icon={ <FilterIcon /> } />
				</fui.MenuTrigger>
			</fui.Tooltip>

			<fui.MenuPopover>
				<fui.MenuList>
					<fui.MenuItemCheckbox name="hidden" value="show" icon={ <HiddenIcon /> }>
						{ i18n.t("main.list.searchbar.show_hidden") }
					</fui.MenuItemCheckbox>
					<fui.MenuItemCheckbox name="default" value="any" icon={ <AnyColorIcon /> }>
						{ i18n.t("colors.any") }
					</fui.MenuItemCheckbox>
					<fui.MenuDivider />
					<fui.MenuItemCheckbox name="colors" value="none" icon={ <NoColorIcon /> }>
						{ i18n.t("colors.none") }
					</fui.MenuItemCheckbox>

					{ Object.keys(colorCls).map(i =>
						<fui.MenuItemCheckbox
							key={ i } name="colors" value={ i }
							icon={
								<ColorIcon
									className={ fui.mergeClasses(
										cls.colorIcon,
										colorCls[i as `${Browser.tabGroups.Color}`]
									) } />
							}
						>
							{ i18n.t(`colors.${i as `${Browser.tabGroups.Color}`}`) }
						</fui.MenuItemCheckbox>
					) }
				</fui.MenuList>
			</fui.MenuPopover>
		</fui.Menu>
	);
}

export type FilterCollectionsButtonProps =
	{
		value?: CollectionFilterType["colors"];
		showHidden?: boolean;
		onChange?: (value: CollectionFilterType["colors"], showHidden: boolean) => void;
	};

const useStyles = fui.makeStyles({
	colorIcon:
	{
		color: "var(--border)"
	}
});
