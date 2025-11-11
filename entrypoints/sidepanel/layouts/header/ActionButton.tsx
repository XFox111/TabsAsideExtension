import { useCollections } from "@/entrypoints/sidepanel/contexts/CollectionsProvider";
import { track } from "@/features/analytics";
import useSettings, { SettingsValue } from "@/hooks/useSettings";
import { CollectionItem } from "@/models/CollectionModels";
import { closeTabsAsync } from "@/utils/closeTabsAsync";
import { createCollectionFromTabs } from "@/utils/createCollectionFromTabs";
import { getTabsToSaveAsync } from "@/utils/getTabsToSaveAsync";
import sendPartialSaveNotification from "@/utils/sendPartialSaveNotification";
import watchTabSelection from "@/utils/watchTabSelection";
import { Menu, MenuButtonProps, MenuItem, MenuList, MenuPopover, MenuTrigger, SplitButton } from "@fluentui/react-components";
import * as ic from "@fluentui/react-icons";
import { ReactElement } from "react";

export default function ActionButton(): ReactElement
{
	const { addCollection } = useCollections();
	const [defaultAction] = useSettings("defaultSaveAction");
	const [selection, setSelection] = useState<"all" | "selected">("all");

	const handleAction = async (primary: boolean) =>
	{
		const [tabs, skipCount] = await getTabsToSaveAsync();

		if (tabs.length < 1)
		{
			await sendPartialSaveNotification();
			return;
		}

		const collection: CollectionItem = await createCollectionFromTabs(tabs);
		await addCollection(collection);

		if (skipCount > 0)
			await sendPartialSaveNotification();

		const closeTabs: boolean = primary === (defaultAction === "set_aside");

		if (closeTabs)
			await closeTabsAsync(tabs);

		track(closeTabs ? "set_aside" : "save");
	};

	useEffect(() =>
	{
		return watchTabSelection(setSelection);
	}, []);

	if (defaultAction === null)
		return <div />;

	const primaryActionKey: ActionsKey = `${defaultAction}.${selection}`;
	const PrimaryIcon = actionIcons[primaryActionKey];
	const secondaryActionKey: ActionsKey = `${defaultAction === "save" ? "set_aside" : "save"}.${selection}`;
	const SecondaryIcon = actionIcons[secondaryActionKey];

	return (
		<Menu positioning="below-end">
			<MenuTrigger disableButtonEnhancement>
				{ (triggerProps: MenuButtonProps) => (
					<SplitButton
						appearance="primary"
						icon={ <PrimaryIcon /> }
						menuButton={ triggerProps }
						primaryActionButton={ { onClick: () => handleAction(true) } }
					>
						{ i18n.t(`actions.${primaryActionKey}`) }
					</SplitButton>
				) }
			</MenuTrigger>

			<MenuPopover>
				<MenuList>
					<MenuItem icon={ <SecondaryIcon /> } onClick={ () => handleAction(false) }>
						{ i18n.t(`actions.${secondaryActionKey}`) }
					</MenuItem>
				</MenuList>
			</MenuPopover>
		</Menu>
	);
}

const actionIcons: Record<ActionsKey, ic.FluentIcon> =
{
	"save.all": ic.bundleIcon(ic.SaveArrowRight20Filled, ic.SaveArrowRight20Regular),
	"save.selected": ic.bundleIcon(ic.SaveCopy20Filled, ic.SaveCopy20Regular),
	"set_aside.all": ic.bundleIcon(ic.ArrowRight20Filled, ic.ArrowRight20Regular),
	"set_aside.selected": ic.bundleIcon(ic.CopyArrowRight20Filled, ic.CopyArrowRight20Regular)
};

export type ActionsKey = `${SettingsValue<"defaultSaveAction">}.${"all" | "selected"}`;

export type ActionsValue =
	{
		label: string;
		icon: ic.FluentIcon;
	};
