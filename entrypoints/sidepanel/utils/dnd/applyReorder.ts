import { CollectionItem, GroupItem, TabItem } from "@/models/CollectionModels";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { DndItem } from "../../hooks/useDndItem";

export default function applyReorder(collections: CollectionItem[], { over, active }: DragEndEvent): null | CollectionItem[]
{
	if (!over || active.id === over.id)
		return null;

	const activeItem: DndItem = active.data.current as DndItem;
	const overItem: DndItem = over.data.current as DndItem;

	console.log("DragEnd", `active: ${active.id} ${activeItem.item.type}`, `over: ${over.id} ${overItem.item.type}`);

	let newList: CollectionItem[] = [
		...collections.map(collection => ({
			...collection,
			items: collection.items.map<TabItem | GroupItem>(item =>
				item.type === "group" ?
					{ ...item, items: item.items.map(tab => ({ ...tab })) } :
					{ ...item }
			)
		}))
	];

	if (activeItem.item.type === "collection")
	{
		newList = arrayMove(
			newList,
			activeItem.indices[0],
			overItem.indices[0]
		);

		return newList;
	}

	const sourceItem: GroupItem | CollectionItem = activeItem.indices.length > 2 ?
		(newList[activeItem.indices[0]].items[activeItem.indices[1]] as GroupItem) :
		newList[activeItem.indices[0]];

	if ((over.id as string).endsWith("_dropzone") || overItem.item.type === "collection")
	{
		const destItem: GroupItem | CollectionItem = overItem.indices.length > 1 ?
			(newList[overItem.indices[0]].items[overItem.indices[1]] as GroupItem) :
			newList[overItem.indices[0]];

		destItem.items.push(activeItem.item as any);
		sourceItem.items.splice(activeItem.indices[activeItem.indices.length - 1], 1);
	}
	else
	{
		sourceItem.items = arrayMove(
			sourceItem.items,
			activeItem.indices[activeItem.indices.length - 1],
			overItem.indices[overItem.indices.length - 1]
		);
	}

	return newList;
}
