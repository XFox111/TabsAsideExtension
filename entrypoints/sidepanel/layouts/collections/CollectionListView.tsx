import CollectionView from "@/entrypoints/sidepanel/components/CollectionView";
import GroupView from "@/entrypoints/sidepanel/components/GroupView";
import { DndItem } from "@/entrypoints/sidepanel/hooks/useDndItem";
import CloudIssueMessages from "@/entrypoints/sidepanel/layouts/collections/messages/CloudIssueMessages";
import CtaMessage from "@/entrypoints/sidepanel/layouts/collections/messages/CtaMessage";
import filterCollections, { CollectionFilterType } from "@/entrypoints/sidepanel/utils/filterCollections";
import sortCollections from "@/entrypoints/sidepanel/utils/sortCollections";
import { track } from "@/features/analytics";
import useSettings from "@/hooks/useSettings";
import { CollectionItem } from "@/models/CollectionModels";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Body1, Button, Caption1, mergeClasses, Subtitle2 } from "@fluentui/react-components";
import { ArrowUndo20Regular, SearchInfo24Regular, Sparkle48Regular } from "@fluentui/react-icons";
import { ReactElement } from "react";
import TabView from "../../components/TabView";
import CollectionContext from "../../contexts/CollectionContext";
import { useCollections } from "../../contexts/CollectionsProvider";
import applyReorder from "../../utils/dnd/applyReorder";
import { collisionDetector } from "../../utils/dnd/collisionDetector";
import { useStyles_CollectionListView } from "./CollectionListView.styles";
import SearchBar from "./SearchBar";
import StorageCapacityIssueMessage from "./messages/StorageCapacityIssueMessage";

export default function CollectionListView(): ReactElement
{
	const { tilesView, updateCollections, collections } = useCollections();

	const [sortMode, setSortMode] = useSettings("sortMode");
	const [query, setQuery] = useState<string>("");
	const [colors, setColors] = useState<CollectionFilterType["colors"]>([]);

	const [active, setActive] = useState<DndItem | null>(null);

	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { delay: 100, tolerance: 0 } }),
		useSensor(TouchSensor, { activationConstraint: { delay: 300, tolerance: 20 } })
	);

	const resultList = useMemo(
		() => sortCollections(filterCollections(collections, { query, colors }), sortMode),
		[query, colors, sortMode, collections]
	);

	const cls = useStyles_CollectionListView();

	const resetFilter = useCallback(() =>
	{
		setQuery("");
		setColors([]);
	}, []);

	const handleDragStart = (event: DragStartEvent): void =>
	{
		setActive(event.active.data.current as DndItem);
	};

	const handleDragEnd = (args: DragEndEvent): void =>
	{
		setActive(null);
		const result: CollectionItem[] | null = applyReorder(resultList, args);

		if (result !== null)
		{
			updateCollections(result);
			if (sortMode !== "custom")
				setSortMode("custom");

			track("used_drag_and_drop");
		}
	};

	if (sortMode === null || collections === null)
		return <></>;

	if (collections.length < 1)
		return (
			<article className={ cls.empty }>
				<Sparkle48Regular />
				<Subtitle2 align="center">{ i18n.t("main.list.empty.title") }</Subtitle2>
				<Caption1 align="center">{ i18n.t("main.list.empty.message") }</Caption1>
			</article>
		);

	return (
		<article className={ cls.root }>
			<SearchBar
				query={ query } onQueryChange={ setQuery }
				filter={ colors } onFilterChange={ setColors }
				sort={ sortMode } onSortChange={ setSortMode }
				onReset={ resetFilter } />

			<CtaMessage className={ cls.msgBar } />
			<StorageCapacityIssueMessage className={ cls.msgBar } />
			<CloudIssueMessages className={ cls.msgBar } />

			{ resultList.length < 1 ?
				<div className={ cls.emptySearch }>
					<SearchInfo24Regular />
					<Subtitle2>{ i18n.t("main.list.empty_search.title") }</Subtitle2>
					<Body1>{ i18n.t("main.list.empty_search.message") }</Body1>
					<Button appearance="subtle" icon={ <ArrowUndo20Regular /> } onClick={ resetFilter }>
						{ i18n.t("common.actions.reset_filters") }
					</Button>
				</div>
				:
				<section className={ mergeClasses(cls.collectionList, !tilesView && cls.listView) }>
					<DndContext
						sensors={ sensors }
						collisionDetection={ collisionDetector(!tilesView) }
						onDragStart={ handleDragStart }
						onDragEnd={ handleDragEnd }
					>
						<SortableContext
							items={ resultList.map((_, index) => index.toString()) }
							strategy={ tilesView ? verticalListSortingStrategy : rectSortingStrategy }
						>
							{ resultList.map((collection, index) =>
								<CollectionView key={ index } collection={ collection } index={ index } />
							) }
						</SortableContext>

						<DragOverlay dropAnimation={ null }>
							{ active &&
								<>
									{ active.item.type === "collection" &&
										<CollectionView collection={ active.item } index={ -1 } dragOverlay />
									}
									{ active.item.type === "group" &&
										<CollectionContext.Provider
											value={ {
												tabCount: 0,
												collectionIndex: active.indices[0],
												collection: resultList[active.indices[0]],
												hasPinnedGroup: true
											} }
										>
											<GroupView group={ active.item } indices={ [-1] } dragOverlay />
										</CollectionContext.Provider>
									}
									{ active.item.type === "tab" &&
										<TabView tab={ active.item } indices={ [-1] } dragOverlay />
									}
								</>
							}
						</DragOverlay>
					</DndContext>
				</section>
			}
		</article>
	);
}
