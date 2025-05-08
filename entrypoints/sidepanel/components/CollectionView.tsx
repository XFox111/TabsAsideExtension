import CollectionHeader from "@/entrypoints/sidepanel/components/collections/CollectionHeader";
import useDndItem from "@/entrypoints/sidepanel/hooks/useDndItem";
import { useGroupColors } from "@/hooks/useGroupColors";
import { CollectionItem } from "@/models/CollectionModels";
import { horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Body1Strong, mergeClasses } from "@fluentui/react-components";
import { CollectionsRegular } from "@fluentui/react-icons";
import { ReactElement } from "react";
import CollectionContext from "../contexts/CollectionContext";
import { useCollections } from "../contexts/CollectionsProvider";
import { useStyles_CollectionView } from "./CollectionView.styles";
import GroupView from "./GroupView";
import TabView from "./TabView";

export default function CollectionView({ collection, index: collectionIndex, dragOverlay }: CollectionViewProps): ReactElement
{
	const { tilesView } = useCollections();
	const {
		setNodeRef,
		nodeProps,
		setActivatorNodeRef,
		activatorProps,
		activeItem, isCurrentlySorting, isBeingDragged, isActiveOverThis: isOver
	} = useDndItem({ id: collectionIndex.toString(), data: { indices: [collectionIndex], item: collection } });

	const isActiveOverThis: boolean = isOver && activeItem?.item.type !== "collection";

	const tabCount: number = useMemo(() => collection.items.flatMap(i => i.type === "group" ? i.items : i).length, [collection.items]);
	const hasPinnedGroup: boolean = useMemo(() => collection.items.length > 0 &&
		(collection.items[0].type === "group" && collection.items[0].pinned === true), [collection.items]);

	const cls = useStyles_CollectionView();
	const colorCls = useGroupColors();

	return (
		<CollectionContext.Provider value={ { collection, tabCount, hasPinnedGroup } }>
			<div
				ref={ setNodeRef } { ...nodeProps }
				className={ mergeClasses(
					cls.root,
					collection.color && colorCls[collection.color],
					collection.color && cls.color,
					!tilesView && cls.verticalRoot,
					dragOverlay && cls.dragOverlay,
					isBeingDragged && cls.dragging,
					isCurrentlySorting && cls.sorting,
					isActiveOverThis && cls.draggingOver
				) }
			>

				<CollectionHeader dragHandleProps={ activatorProps } dragHandleRef={ setActivatorNodeRef } />

				{ collection.items.length < 1 ?
					<div className={ cls.empty }>
						<CollectionsRegular fontSize={ 32 } />
						<Body1Strong>{ i18n.t("collections.empty") }</Body1Strong>
					</div>
					:
					<div className={ mergeClasses(cls.list, !tilesView && cls.verticalList) }>
						<SortableContext
							items={ collection.items.map((_, index) => [collectionIndex, index].join("/")) }
							strategy={ tilesView ? horizontalListSortingStrategy : verticalListSortingStrategy }
						>
							{ collection.items.map((i, index) =>
								i.type === "group" ?
									<GroupView
										key={ index } group={ i } indices={ [collectionIndex, index] } />
									:
									<TabView key={ index } tab={ i } indices={ [collectionIndex, index] } />
							) }
						</SortableContext>
					</div>
				}
			</div >
		</CollectionContext.Provider>
	);
}

export type CollectionViewProps =
	{
		collection: CollectionItem;
		index: number;
		dragOverlay?: boolean;
	};
