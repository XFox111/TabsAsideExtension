import { CollectionItem, GroupItem, TabItem } from "@/models/CollectionModels";
import { useSortable } from "@dnd-kit/sortable";
import { Arguments } from "@dnd-kit/sortable/dist/hooks/useSortable";

export default function useDndItem(args: Arguments): DndItemHook
{
	const {
		setActivatorNodeRef, setNodeRef,
		transform, attributes, listeners,
		active, over,
		isDragging,
		isSorting,
		isOver
	} = useSortable({ transition: null, ...args });

	return {
		setActivatorNodeRef,
		setNodeRef,
		nodeProps:
		{
			style:
			{
				transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined
			},
			...attributes
		},
		activatorProps:
		{
			...listeners,
			style:
			{
				cursor: args.disabled ? undefined : "grab"
			}
		},
		activeItem: active ? { ...active.data.current, id: active.id } as DndItem : null,
		overItem: over ? { ...over.data.current, id: over.id } as DndItem : null,
		isBeingDragged: isDragging,
		isCurrentlySorting: isSorting,
		isActiveOverThis: isOver
	};
}

export type DndItem =
	{
		id: string;
		indices: number[];
		item: (TabItem | CollectionItem | GroupItem);
	};

export type DndItemHook =
	{
		setNodeRef: (element: HTMLElement | null) => void;
		setActivatorNodeRef: (element: HTMLElement | null) => void;
		nodeProps: React.HTMLAttributes<HTMLElement>;
		activatorProps: React.HTMLAttributes<HTMLElement>;
		activeItem: DndItem | null;
		overItem: DndItem | null;
		isBeingDragged: boolean;
		isCurrentlySorting: boolean;
		isActiveOverThis: boolean;
	};
