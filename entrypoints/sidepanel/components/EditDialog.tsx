import { getCollectionTitle } from "@/entrypoints/sidepanel/utils/getCollectionTitle";
import { track } from "@/features/analytics";
import { useGroupColors } from "@/hooks/useGroupColors";
import { CollectionItem, GroupItem } from "@/models/CollectionModels";
import * as fui from "@fluentui/react-components";
import { Circle20Filled, CircleOff20Regular, Pin20Filled, Rename20Regular } from "@fluentui/react-icons";
import { ReactElement } from "react";
import { useStyles_EditDialog } from "./EditDialog.styles";

export default function EditDialog(props: GroupEditDialogProps): ReactElement
{
	const [title, setTitle] = useState<string>(
		(props.type === "collection"
			? props.collection?.title :
			(props.group?.pinned !== true ? props.group?.title : ""))
		?? ""
	);

	const [color, setColor] = useState<chrome.tabGroups.ColorEnum | undefined | "pinned">(
		props.type === "collection"
			? props.collection?.color :
			props.group?.pinned === true ? "pinned" : (props.group?.color ?? "blue")
	);

	const cls = useStyles_EditDialog();
	const colorCls = useGroupColors();

	const handleSave = () =>
	{
		if (props.type === "collection" ? props.collection !== null : props.group !== null)
			track("item_edited", { type: props.type });
		else
			track("item_created", { type: props.type });

		if (props.type === "collection")
			props.onSave({
				type: "collection",
				timestamp: props.collection?.timestamp ?? Date.now(),
				color: (color === "pinned") ? undefined : color!,
				title: title ? title : undefined,
				items: props.collection?.items ?? []
			});
		else if (color === "pinned")
			props.onSave({
				type: "group",
				pinned: true,
				items: props.group?.items ?? []
			});
		else
			props.onSave({
				type: "group",
				pinned: false,
				color: color!,
				title: title ? title : undefined,
				items: props.group?.items ?? []
			});
	};

	return (
		<fui.DialogSurface className={ fui.mergeClasses(cls.surface, (color && color !== "pinned") && colorCls[color]) }>
			<fui.DialogBody>
				<fui.DialogTitle>
					{
						props.type === "collection" ?
							i18n.t(`dialogs.edit.title.${props.collection ? "edit" : "new"}_collection`) :
							i18n.t(`dialogs.edit.title.${props.group ? "edit" : "new"}_group`)
					}
				</fui.DialogTitle>

				<fui.DialogContent>
					<form className={ cls.content }>
						<fui.Field label={ i18n.t("dialogs.edit.collection_title") }>
							<fui.Input
								contentBefore={ <Rename20Regular /> }
								disabled={ color === "pinned" }
								placeholder={
									props.type === "collection" ? getCollectionTitle(props.collection, true) : ""
								}
								value={ color === "pinned" ? i18n.t("groups.pinned") : title }
								onChange={ (_, e) => setTitle(e.value) } />
						</fui.Field>
						<fui.Field label="Color">
							<div className={ cls.colorPicker }>
								{ (props.type === "group" && (!props.hidePinned || props.group?.pinned)) &&
									<fui.ToggleButton
										checked={ color === "pinned" }
										onClick={ () => setColor("pinned") }
										icon={ <Pin20Filled /> }
										shape="circular"
									>
										{ i18n.t("groups.pinned") }
									</fui.ToggleButton>
								}
								{ props.type === "collection" &&
									<fui.ToggleButton
										checked={ color === undefined }
										onClick={ () => setColor(undefined) }
										icon={ <CircleOff20Regular /> }
										shape="circular"
									>
										{ i18n.t("colors.none") }
									</fui.ToggleButton>
								}
								{ Object.keys(colorCls).map(i =>
									<fui.ToggleButton
										checked={ color === i }
										onClick={ () => setColor(i as chrome.tabGroups.ColorEnum) }
										className={ fui.mergeClasses(cls.colorButton, colorCls[i as chrome.tabGroups.ColorEnum]) }
										icon={ {
											className: cls.colorButton_icon,
											children: <Circle20Filled />
										} }
										key={ i }
										shape="circular"
									>
										{ i18n.t(`colors.${i as chrome.tabGroups.ColorEnum}`) }
									</fui.ToggleButton>
								) }
							</div>
						</fui.Field>
					</form>
				</fui.DialogContent>

				<fui.DialogActions>
					<fui.DialogTrigger disableButtonEnhancement>
						<fui.Button appearance="primary" onClick={ handleSave }>{ i18n.t("common.actions.save") }</fui.Button>
					</fui.DialogTrigger>
					<fui.DialogTrigger disableButtonEnhancement>
						<fui.Button appearance="subtle">{ i18n.t("common.actions.cancel") }</fui.Button>
					</fui.DialogTrigger>
				</fui.DialogActions>
			</fui.DialogBody>
		</fui.DialogSurface>
	);
}

export type GroupEditDialogProps =
	{
		type: "collection";
		collection?: CollectionItem;
		onSave: (item: CollectionItem) => void;
	} |
	{
		type: "group";
		hidePinned?: boolean;
		group?: GroupItem;
		onSave: (item: GroupItem) => void;
	};
