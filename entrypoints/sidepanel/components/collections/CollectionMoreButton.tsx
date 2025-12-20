import { useDialog } from "@/contexts/DialogProvider";
import { useDangerStyles } from "@/hooks/useDangerStyles";
import useSettings from "@/hooks/useSettings";
import { Button, Menu, MenuDivider, MenuItem, MenuList, MenuOpenChangeData, MenuOpenEvent, MenuPopover, MenuTrigger, Tooltip } from "@fluentui/react-components";
import * as ic from "@fluentui/react-icons";
import CollectionContext, { CollectionContextType } from "../../contexts/CollectionContext";
import { useCollections } from "../../contexts/CollectionsProvider";
import exportCollectionToBookmarks from "../../utils/exportCollectionToBookmarks";
import EditDialog from "../EditDialog";

export default function CollectionMoreButton({ onAddSelected, onOpenChange }: CollectionMoreButtonProps): React.ReactElement
{
	const [listLocation] = useSettings("listLocation");
	const isTab: boolean = listLocation === "tab" || listLocation === "pinned";
	const { removeItem, updateCollection } = useCollections();
	const { tabCount, hasPinnedGroup, collection } = useContext<CollectionContextType>(CollectionContext);
	const dialog = useDialog();
	const [deletePrompt] = useSettings("deletePrompt");

	const AddIcon = ic.bundleIcon(ic.Add20Filled, ic.Add20Regular);
	const GroupIcon = ic.bundleIcon(ic.GroupList20Filled, ic.GroupList20Regular);
	const EditIcon = ic.bundleIcon(ic.Edit20Filled, ic.Edit20Regular);
	const DeleteIcon = ic.bundleIcon(ic.Delete20Filled, ic.Delete20Regular);
	const BookmarkIcon = ic.bundleIcon(ic.BookmarkAdd20Filled, ic.BookmarkAdd20Regular);
	const ShowIcon = ic.bundleIcon(ic.Eye20Filled, ic.Eye20Regular);
	const HideIcon = ic.bundleIcon(ic.EyeOff20Filled, ic.EyeOff20Regular);

	const dangerCls = useDangerStyles();

	const handleDelete = () =>
	{
		if (deletePrompt)
			dialog.pushPrompt({
				title: i18n.t("collections.menu.delete"),
				content: i18n.t("common.delete_prompt"),
				destructive: true,
				confirmText: i18n.t("common.actions.delete"),
				onConfirm: () => removeItem(collection.timestamp)
			});
		else
			removeItem(collection.timestamp);
	};

	const toggleHidden = () =>
	{
		updateCollection({ ...collection, hidden: !collection.hidden }, collection.timestamp);
	};

	const handleEdit = () =>
		dialog.pushCustom(
			<EditDialog
				type="collection"
				collection={ collection }
				onSave={ item => updateCollection(item, collection.timestamp) } />
		);

	const handleCreateGroup = () =>
		dialog.pushCustom(
			<EditDialog
				type="group"
				hidePinned={ hasPinnedGroup }
				onSave={ group => updateCollection({ ...collection, items: [...collection.items, group] }, collection.timestamp) } />
		);

	return (
		<Menu onOpenChange={ onOpenChange }>
			<Tooltip relationship="label" content={ i18n.t("common.tooltips.more") }>
				<MenuTrigger>
					<Button appearance="subtle" icon={ <ic.MoreVertical20Regular /> } />
				</MenuTrigger>
			</Tooltip>

			<MenuPopover>
				<MenuList>
					{ tabCount > 0 &&
						<MenuItem icon={ <AddIcon /> } onClick={ () => onAddSelected?.() }>
							{ isTab ? i18n.t("collections.menu.add_all") : i18n.t("collections.menu.add_selected") }
						</MenuItem>
					}
					<MenuItem icon={ <GroupIcon /> } onClick={ handleCreateGroup }>
						{ i18n.t("collections.menu.add_group") }
					</MenuItem>
					{ tabCount > 0 &&
						<MenuItem icon={ <BookmarkIcon /> } onClick={ () => exportCollectionToBookmarks(collection) }>
							{ i18n.t("collections.menu.export_bookmarks") }
						</MenuItem>
					}
					<MenuDivider />
					<MenuItem icon={ <EditIcon /> } onClick={ handleEdit }>
						{ i18n.t("collections.menu.edit") }
					</MenuItem>
					<MenuItem icon={ collection.hidden ? <ShowIcon /> : <HideIcon /> } onClick={ toggleHidden }>
						{ collection.hidden ? i18n.t("collections.menu.unhide") : i18n.t("collections.menu.hide") }
					</MenuItem>
					<MenuItem icon={ <DeleteIcon /> } className={ dangerCls.menuItem } onClick={ handleDelete }>
						{ i18n.t("collections.menu.delete") }
					</MenuItem>
				</MenuList>
			</MenuPopover>
		</Menu>
	);
}

export type CollectionMoreButtonProps =
	{
		onAddSelected?: () => void;
		onOpenChange?: (e: MenuOpenEvent, data: MenuOpenChangeData) => void;
	};
