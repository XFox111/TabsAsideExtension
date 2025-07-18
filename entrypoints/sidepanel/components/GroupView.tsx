import GroupContext from "@/entrypoints/sidepanel/contexts/GroupContext";
import useDndItem from "@/entrypoints/sidepanel/hooks/useDndItem";
import { openGroup } from "@/entrypoints/sidepanel/utils/opener";
import { useGroupColors } from "@/hooks/useGroupColors";
import useSettings from "@/hooks/useSettings";
import { GroupItem } from "@/models/CollectionModels";
import { horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Caption1Strong, Link, mergeClasses, Tooltip } from "@fluentui/react-components";
import { Pin16Filled, WebAssetRegular } from "@fluentui/react-icons";
import { ReactElement } from "react";
import { useCollections } from "../contexts/CollectionsProvider";
import GroupDropZone from "./collections/GroupDropZone";
import GroupMoreMenu from "./collections/GroupMoreMenu";
import { useStyles_GroupView } from "./GroupView.styles";
import TabView from "./TabView";

export default function GroupView({ group, indices, dragOverlay }: GroupViewProps): ReactElement
{
	const [alwaysShowToolbars] = useSettings("alwaysShowToolbars");
	const { tilesView } = useCollections();

	const groupId: string = useMemo(() => indices.join("/"), [indices]);

	const {
		setNodeRef, nodeProps,
		setActivatorNodeRef, activatorProps,
		activeItem: active, isBeingDragged
	} = useDndItem({ id: groupId, data: { indices, item: group }, disabled: group.pinned });

	const disableDropZone: boolean = useMemo(
		() => active !== null &&
			(active.item.type !== "tab" || (active.indices[0] === indices[0] && active.indices[1] === indices[1])),
		[active, indices]);
	const disableSorting: boolean = useMemo(
		() => active !== null && (active.item.type !== "tab" || active.indices[0] !== indices[0]),
		[active, indices]);

	const cls = useStyles_GroupView();
	const colorCls = useGroupColors();

	return (
		<GroupContext.Provider value={ { group, indices } }>
			<div
				ref={ setNodeRef } { ...nodeProps }
				className={ mergeClasses(
					cls.root,
					group.pinned === true ? cls.pinnedColor : colorCls[group.color],
					isBeingDragged && cls.dragging,
					dragOverlay && cls.dragOverlay
				) }
			>
				<div className={ mergeClasses(cls.header, !tilesView && cls.verticalHeader) }>

					<div
						ref={ setActivatorNodeRef } { ...activatorProps }
						className={ mergeClasses(cls.title, group.pinned && cls.pinned, !tilesView && cls.verticalTitle) }
					>
						{ group.pinned === true ?
							<>
								<Pin16Filled />
								<Caption1Strong truncate wrap={ false }>{ i18n.t("groups.pinned") }</Caption1Strong>
							</>
							:
							<Tooltip relationship="description" content={ group.title ?? "" }>
								<Caption1Strong truncate wrap={ false }>{ group.title }</Caption1Strong>
							</Tooltip>
						}
					</div>

					<div className={ mergeClasses(cls.toolbar, "GroupView-toolbar", alwaysShowToolbars === true && cls.showToolbar) }>
						{ group.items.length > 0 &&
							<Link className={ cls.openAllLink } onClick={ () => openGroup(group, false) }>
								{ i18n.t("groups.open") }
							</Link>
						}

						<GroupMoreMenu />
					</div>
				</div>

				<GroupDropZone
					disabled={ disableDropZone }
					className={ mergeClasses(cls.listContainer, !tilesView && cls.verticalListContainer) }
				>
					{ group.items.length < 1 ?
						<div className={ mergeClasses(cls.empty, !tilesView && cls.verticalEmpty) }>
							<WebAssetRegular fontSize={ 32 } />
							<Caption1Strong>{ i18n.t("groups.empty") }</Caption1Strong>
						</div>
						:
						<div
							className={ mergeClasses(
								cls.list,
								!tilesView && cls.verticalList,
								((active?.item.type === "group" && active?.indices[0] === indices[0]) || dragOverlay) && (tilesView ? cls.horizontalListCollapsed : cls.verticalListCollapsed)
							) }
						>
							<SortableContext
								items={ group.items.map((_, index) => [...indices, index].join("/")) }
								disabled={ disableSorting }
								strategy={ !tilesView ? verticalListSortingStrategy : horizontalListSortingStrategy }
							>
								{ group.items.map((i, index) =>
									<TabView key={ index } tab={ i } indices={ [...indices, index] } />
								) }
							</SortableContext>
						</div>
					}
				</GroupDropZone>
			</div>
		</GroupContext.Provider>
	);
}

export type GroupViewProps =
	{
		group: GroupItem;
		indices: number[];
		dragOverlay?: boolean;
	};
