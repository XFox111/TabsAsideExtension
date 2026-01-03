import faviconPlaceholder from "@/assets/FaviconPlaceholder.svg";
import pagePlaceholder from "@/assets/PagePlaceholder.svg";
import { useDialog } from "@/contexts/DialogProvider";
import { useCollections } from "@/entrypoints/sidepanel/contexts/CollectionsProvider";
import useDndItem from "@/entrypoints/sidepanel/hooks/useDndItem";
import useSettings from "@/hooks/useSettings";
import { CollectionItem, GroupItem, TabItem } from "@/models/CollectionModels";
import { Caption1, Link, mergeClasses, Tooltip } from "@fluentui/react-components";
import { MouseEventHandler, ReactElement } from "react";
import { useStyles_TabView } from "./TabView.styles";
import CollectionContext, { CollectionContextType } from "../contexts/CollectionContext";
import TabMoreButton from "./TabMoreButton";
import TabEditDialog from "./TabEditDialog";

export default function TabView({ tab, indices, dragOverlay, collectionId }: TabViewProps): ReactElement
{
	const { removeItem, graphics, tilesView, collections, updateCollection } = useCollections();
	const { collection } = useContext<CollectionContextType>(CollectionContext);
	const {
		setNodeRef, setActivatorNodeRef,
		nodeProps, activatorProps, isBeingDragged
	} = useDndItem({ id: indices.join("/"), data: { indices, item: tab } });
	const dialog = useDialog();

	const [deletePrompt] = useSettings("deletePrompt");
	const [showToolbar] = useSettings("alwaysShowToolbars");

	const cls = useStyles_TabView();

	const handleDelete = (): void =>
	{
		const removeIndex: number[] = [collection.timestamp, ...indices.slice(1)];

		if (deletePrompt)
			dialog.pushPrompt({
				title: i18n.t("tabs.delete"),
				content: i18n.t("common.delete_prompt"),
				destructive: true,
				confirmText: i18n.t("common.actions.delete"),
				onConfirm: () => removeItem(...removeIndex)
			});
		else
			removeItem(...removeIndex);
	};

	const handleEdit = (): void =>
	{
		if (collectionId < 0)
			return;

		const updateTab = async (updatedTab: TabItem): Promise<void> =>
		{
			const collection: CollectionItem = collections!.find(i => i.timestamp === collectionId)!;

			if (indices.length > 2)
				(collection.items[indices[1]] as GroupItem).items[indices[2]] = updatedTab;
			else
				collection.items[indices[1]] = updatedTab;

			await updateCollection(collection, collection.timestamp);
		};

		dialog.pushCustom(<TabEditDialog tab={ tab } onSave={ updateTab } />);
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
					src={ graphics[tab.url]?.preview ?? graphics[tab.url]?.capture ?? pagePlaceholder }
					onError={ e => e.currentTarget.src = pagePlaceholder }
					className={ cls.image } draggable={ false } />
			}

			<div className={ cls.header }>
				<img
					ref={ setActivatorNodeRef } { ...activatorProps }
					src={ graphics[tab.url]?.icon ?? faviconPlaceholder }
					onError={ e => e.currentTarget.src = faviconPlaceholder }
					className={ cls.icon } draggable={ false } />

				<Tooltip relationship="description" content={ tab.title ?? tab.url }>
					<Caption1 truncate wrap={ false } className={ cls.title }>
						{ tab.title ?? tab.url }
					</Caption1>
				</Tooltip>

				<TabMoreButton
					className={ mergeClasses(cls.deleteButton, showToolbar === true && cls.showDeleteButton) }
					onEdit={ handleEdit }
					onDelete={ handleDelete } />
			</div>
		</Link>
	);
}

export type TabViewProps =
	{
		tab: TabItem;
		indices: number[];
		dragOverlay?: boolean;
		collectionId: number;
	};
