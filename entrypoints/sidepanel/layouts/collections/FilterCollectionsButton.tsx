import { useGroupColors } from "@/hooks/useGroupColors";
import * as fui from "@fluentui/react-components";
import * as ic from "@fluentui/react-icons";
import { CollectionFilterType } from "../../utils/filterCollections";

export default function FilterCollectionsButton({ value, onChange }: FilterCollectionsButtonProps): React.ReactElement
{
	const cls = useStyles();
	const colorCls = useGroupColors();

	const ColorFilterIcon = ic.bundleIcon(ic.Color20Filled, ic.Color20Regular);
	const ColorIcon = ic.bundleIcon(ic.Circle20Filled, ic.CircleHalfFill20Regular);
	const NoColorIcon = ic.bundleIcon(ic.CircleOffFilled, ic.CircleOffRegular);
	const AnyColorIcon = ic.bundleIcon(ic.PhotoFilter20Filled, ic.PhotoFilter20Regular);

	return (
		<fui.Menu
			checkedValues={ !value || value.length < 1 ? { default: ["any"] } : { colors: value } }
			onCheckedValueChange={ (_, e) =>
				onChange?.(e.checkedItems.includes("any") ? [] : e.checkedItems as CollectionFilterType["colors"])
			}
		>

			<fui.Tooltip relationship="label" content={ i18n.t("main.list.searchbar.filter") }>
				<fui.MenuTrigger disableButtonEnhancement>
					<fui.Button appearance="subtle" icon={ <ColorFilterIcon /> } />
				</fui.MenuTrigger>
			</fui.Tooltip>

			<fui.MenuPopover>
				<fui.MenuList>
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
		onChange?: (value: CollectionFilterType["colors"]) => void;
	};

const useStyles = fui.makeStyles({
	colorIcon:
	{
		color: "var(--border)"
	}
});
