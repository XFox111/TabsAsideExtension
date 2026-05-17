import { useDangerStyles } from "@/hooks/useDangerStyles";
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Tooltip } from "@fluentui/react-components";
import { bundleIcon, Delete20Filled, Delete20Regular, Edit20Filled, Edit20Regular, MoreHorizontal20Regular } from "@fluentui/react-icons";
import { ButtonHTMLAttributes } from "react";

export default function TabMoreButton({ onEdit, onDelete, ...props }: TabMoreButtonProps): React.ReactElement
{
	const EditIcon = bundleIcon(Edit20Filled, Edit20Regular);
	const DeleteIcon = bundleIcon(Delete20Filled, Delete20Regular);
	const dangerCls = useDangerStyles();

	const onClick = (ev: React.MouseEvent): void =>
	{
		ev.stopPropagation();
		ev.preventDefault();
	};

	return (
		<Menu>
			<Tooltip relationship="label" content={ i18n.t("common.tooltips.more") }>
				<MenuTrigger disableButtonEnhancement>
					<Button
						appearance="subtle" icon={ <MoreHorizontal20Regular /> }
						onClick={ onClick }
						{ ...props } />
				</MenuTrigger>
			</Tooltip>

			<MenuPopover onClick={ ev => ev.stopPropagation() }>
				<MenuList>
					<MenuItem icon={ <EditIcon /> } onClick={ onEdit }>
						{ i18n.t("dialogs.edit.title.edit_tab") }
					</MenuItem>
					<MenuItem icon={ <DeleteIcon /> } className={ dangerCls.menuItem } onClick={ onDelete }>
						{ i18n.t("tabs.delete") }
					</MenuItem>
				</MenuList>
			</MenuPopover>
		</Menu>
	);
}

export type TabMoreButtonProps =
	ButtonHTMLAttributes<HTMLButtonElement> &
	{
		onDelete?: () => void;
		onEdit?: () => void;
	};
