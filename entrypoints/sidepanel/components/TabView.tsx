import faviconPlaceholder from "@/assets/FaviconPlaceholder.svg";
import pagePlaceholder from "@/assets/PagePlaceholder.svg";
import { useDialog } from "@/contexts/DialogProvider";
import { useCollections } from "@/entrypoints/sidepanel/contexts/CollectionsProvider";
import useDndItem from "@/entrypoints/sidepanel/hooks/useDndItem";
import useSettings from "@/hooks/useSettings";
import { TabItem } from "@/models/CollectionModels";
import { Button, Caption1, Link, mergeClasses, Tooltip } from "@fluentui/react-components";
import { Dismiss20Regular } from "@fluentui/react-icons";
import { MouseEventHandler, ReactElement } from "react";
import { useStyles_TabView } from "./TabView.styles";

export default function TabView({ tab, indices, dragOverlay }: TabViewProps): ReactElement
{
	const { removeItem, graphics, tilesView } = useCollections();
	const {
		setNodeRef, setActivatorNodeRef,
		nodeProps, activatorProps, isBeingDragged
	} = useDndItem({ id: indices.join("/"), data: { indices, item: tab } });
	const dialog = useDialog();

	const [deletePrompt] = useSettings("deletePrompt");
	const [showToolbar] = useSettings("alwaysShowToolbars");

	const cls = useStyles_TabView();

	const handleDelete: MouseEventHandler<HTMLButtonElement> = (args) =>
	{
		args.preventDefault();
		args.stopPropagation();

		if (deletePrompt)
			dialog.pushPrompt({
				title: i18n.t("tabs.delete"),
				content: i18n.t("common.delete_prompt"),
				destructive: true,
				confirmText: i18n.t("common.actions.delete"),
				onConfirm: () => removeItem(...indices)
			});
		else
			removeItem(...indices);
	};

	const handleClick: MouseEventHandler<HTMLAnchorElement> = (args) =>
	{
		args.preventDefault();
		browser.tabs.create({ url: tab.url, active: true });
	};

	const handleAuxClick: MouseEventHandler<HTMLAnchorElement> = (args) =>
	{
		args.preventDefault();

		if (args.button === 1)
			browser.tabs.create({ url: tab.url, active: false });
	};

	return (
		<Link
			ref={ setNodeRef } { ...nodeProps }
			href={ tab.url }
			onClick={ handleClick } onAuxClick={ handleAuxClick }
			className={ mergeClasses(
				cls.root,
				!tilesView && cls.listView,
				isBeingDragged && cls.dragging,
				dragOverlay && cls.dragOverlay
			) }
		>
			{ tilesView &&
				<img
					src={ graphics[tab.url]?.preview ?? pagePlaceholder }
					onError={ e => e.currentTarget.src = pagePlaceholder }
					className={ cls.image } draggable={ false } />
			}

			<div className={ cls.header }>
				<img
					ref={ setActivatorNodeRef } { ...activatorProps }
					src={ graphics[tab.url]?.icon ?? faviconPlaceholder }
					onError={ e => e.currentTarget.src = faviconPlaceholder }
					height={ 20 } width={ 20 }
					className={ cls.icon } draggable={ false } />

				<Tooltip relationship="description" content={ tab.title ?? tab.url }>
					<Caption1 truncate wrap={ false } className={ cls.title }>
						{ tab.title ?? tab.url }
					</Caption1>
				</Tooltip>

				<Tooltip relationship="label" content={ i18n.t("tabs.delete") }>
					<Button
						className={ mergeClasses(cls.deleteButton, showToolbar === true && cls.showDeleteButton) }
						appearance="subtle" icon={ <Dismiss20Regular /> }
						onClick={ handleDelete } />
				</Tooltip>
			</div>
		</Link>
	);
}

export type TabViewProps =
	{
		tab: TabItem;
		indices: number[];
		dragOverlay?: boolean;
	};
