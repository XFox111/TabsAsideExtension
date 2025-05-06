import { useDialog } from "@/contexts/DialogProvider";
import EditDialog from "@/entrypoints/sidepanel/components/EditDialog";
import CollectionContext, { CollectionContextType } from "@/entrypoints/sidepanel/contexts/CollectionContext";
import { useCollections } from "@/entrypoints/sidepanel/contexts/CollectionsProvider";
import GroupContext, { GroupContextType } from "@/entrypoints/sidepanel/contexts/GroupContext";
import getSelectedTabs from "@/entrypoints/sidepanel/utils/getSelectedTabs";
import { useDangerStyles } from "@/hooks/useDangerStyles";
import useSettings from "@/hooks/useSettings";
import { TabItem } from "@/models/CollectionModels";
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Tooltip } from "@fluentui/react-components";
import * as ic from "@fluentui/react-icons";
import { ReactElement } from "react";
import { openGroup } from "../../utils/opener";

export default function GroupMoreMenu(): ReactElement
{
	const { group, indices } = useContext<GroupContextType>(GroupContext);
	const { hasPinnedGroup } = useContext<CollectionContextType>(CollectionContext);
	const [deletePrompt] = useSettings("deletePrompt");
	const dialog = useDialog();
	const { updateGroup, removeItem, ungroup } = useCollections();

	const dangerCls = useDangerStyles();

	const AddIcon = ic.bundleIcon(ic.Add20Filled, ic.Add20Regular);
	const UngroupIcon = ic.bundleIcon(ic.FullScreenMaximize20Filled, ic.FullScreenMaximize20Regular);
	const EditIcon = ic.bundleIcon(ic.Edit20Filled, ic.Edit20Regular);
	const NewWindowIcon = ic.bundleIcon(ic.WindowNew20Filled, ic.WindowNew20Regular);
	const DeleteIcon = ic.bundleIcon(ic.Delete20Filled, ic.Delete20Regular);

	const handleDelete = () =>
	{
		if (deletePrompt)
			dialog.pushPrompt({
				title: i18n.t("groups.menu.delete"),
				content: i18n.t("common.delete_prompt"),
				confirmText: i18n.t("common.actions.delete"),
				destructive: true,
				onConfirm: () => removeItem(...indices)
			});
		else
			removeItem(...indices);
	};

	const handleEdit = () =>
		dialog.pushCustom(
			<EditDialog
				type="group"
				group={ group }
				hidePinned={ hasPinnedGroup }
				onSave={ item => updateGroup(item, indices[0], indices[1]) } />
		);

	const handleAddSelected = async () =>
	{
		const newTabs: TabItem[] = await getSelectedTabs();
		updateGroup({ ...group, items: [...group.items, ...newTabs] }, indices[0], indices[1]);
	};

	return (
		<Menu>
			<Tooltip relationship="label" content={ i18n.t("common.tooltips.more") }>
				<MenuTrigger>
					<Button size="small" appearance="subtle" icon={ <ic.MoreVertical20Regular /> } />
				</MenuTrigger>
			</Tooltip>

			<MenuPopover>
				<MenuList>
					{ group.items.length > 0 &&
						<MenuItem icon={ <NewWindowIcon /> } onClick={ () => openGroup(group, true) }>
							{ i18n.t("groups.menu.new_window") }
						</MenuItem>
					}

					<MenuItem icon={ <AddIcon /> } onClick={ handleAddSelected }>
						{ i18n.t("groups.menu.add_selected") }
					</MenuItem>

					<MenuItem icon={ <EditIcon /> } onClick={ handleEdit }>
						{ i18n.t("groups.menu.edit") }
					</MenuItem>
					{ group.items.length > 0 &&
						<MenuItem
							className={ dangerCls.menuItem }
							icon={ <UngroupIcon /> }
							onClick={ () => ungroup(indices[0], indices[1]) }
						>
							{ i18n.t("groups.menu.ungroup") }
						</MenuItem>
					}
					<MenuItem className={ dangerCls.menuItem } icon={ <DeleteIcon /> } onClick={ handleDelete }>
						{ i18n.t("groups.menu.delete") }
					</MenuItem>
				</MenuList>
			</MenuPopover>
		</Menu>
	);
}
