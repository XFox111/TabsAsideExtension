import { useDialog } from "@/contexts/DialogProvider";
import useSettings from "@/hooks/useSettings";
import browserLocaleKey from "@/utils/browserLocaleKey";
import { sendMessage } from "@/utils/messaging";
import { Menu, MenuButtonProps, MenuItem, MenuList, MenuOpenChangeData, MenuOpenEvent, MenuPopover, MenuTrigger, SplitButton } from "@fluentui/react-components";
import * as ic from "@fluentui/react-icons";
import CollectionContext, { CollectionContextType } from "../../contexts/CollectionContext";
import { useCollections } from "../../contexts/CollectionsProvider";
import { openCollection } from "../../utils/opener";

export default function OpenCollectionButton({ onOpenChange }: OpenCollectionButtonProps): React.ReactElement
{
	const [defaultAction] = useSettings("defaultRestoreAction");
	const [listLocation] = useSettings("listLocation");
	const { removeItem } = useCollections();
	const dialog = useDialog();
	const { collection } = useContext<CollectionContextType>(CollectionContext);

	const OpenIcon = ic.bundleIcon(ic.Open20Filled, ic.Open20Regular);
	const RestoreIcon = ic.bundleIcon(ic.ArrowExportRtl20Filled, ic.ArrowExportRtl20Regular);
	const NewWindowIcon = ic.bundleIcon(ic.WindowNew20Filled, ic.WindowNew20Regular);
	const InPrivateIcon = ic.bundleIcon(ic.TabInPrivate20Filled, ic.TabInPrivate20Regular);

	const handleIncognito = async () =>
	{
		if (await browser.extension.isAllowedIncognitoAccess())
		{
			if (import.meta.env.FIREFOX && listLocation === "popup")
				sendMessage("openCollection", { collection, targetWindow: "incognito" });
			else
				openCollection(collection, "incognito");
		}
		else
			dialog.pushPrompt({
				title: i18n.t("collections.incognito_check.title"),
				content: (
					<>
						{ i18n.t(`collections.incognito_check.message.${browserLocaleKey}.p1`) }
						<br />
						<br />
						{ i18n.t(`collections.incognito_check.message.${browserLocaleKey}.p2`) }
					</>
				),
				confirmText: i18n.t("collections.incognito_check.action"),
				onConfirm: async () => import.meta.env.FIREFOX ?
					await browser.runtime.openOptionsPage() :
					await browser.tabs.create({
						url: `chrome://extensions/?id=${browser.runtime.id}`,
						active: true
					})
			});
	};

	const handleOpen = (mode: "current" | "new") =>
		import.meta.env.FIREFOX && listLocation === "popup" && mode === "new" ?
			() => sendMessage("openCollection", { collection, targetWindow: "new" }) :
			() => openCollection(collection, mode);

	const handleRestore = async () =>
	{
		await openCollection(collection);
		removeItem(collection.timestamp);
	};

	return (
		<Menu onOpenChange={ onOpenChange }>
			<MenuTrigger disableButtonEnhancement>
				{ (triggerProps: MenuButtonProps) => defaultAction === "restore" ?
					<SplitButton
						appearance="subtle" icon={ <RestoreIcon /> } menuButton={ triggerProps }
						primaryActionButton={ { onClick: handleRestore } }
					>
						{ i18n.t("collections.actions.restore") }
					</SplitButton>
					:
					<SplitButton
						appearance="subtle" icon={ <OpenIcon /> } menuButton={ triggerProps }
						primaryActionButton={ { onClick: handleOpen("current") } }
					>
						{ i18n.t("collections.actions.open") }
					</SplitButton>
				}
			</MenuTrigger>

			<MenuPopover>
				<MenuList>
					{ defaultAction === "restore" ?
						<MenuItem icon={ <OpenIcon /> } onClick={ handleOpen("current") }>
							{ i18n.t("collections.actions.open") }
						</MenuItem>
						:
						<MenuItem icon={ <RestoreIcon /> } onClick={ handleRestore }>
							{ i18n.t("collections.actions.restore") }
						</MenuItem>
					}
					<MenuItem icon={ <NewWindowIcon /> } onClick={ handleOpen("new") }>
						{ i18n.t("collections.actions.new_window") }
					</MenuItem>
					<MenuItem icon={ <InPrivateIcon /> } onClick={ handleIncognito }>
						{ i18n.t(`collections.actions.incognito.${browserLocaleKey}`) }
					</MenuItem>
				</MenuList>
			</MenuPopover>
		</Menu>
	);
}

export type OpenCollectionButtonProps =
	{
		onOpenChange?: (e: MenuOpenEvent, data: MenuOpenChangeData) => void;
	};
