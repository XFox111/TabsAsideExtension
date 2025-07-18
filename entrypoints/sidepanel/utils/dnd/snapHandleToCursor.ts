import { Modifier } from "@dnd-kit/core";
import { Coordinates, getEventCoordinates } from "@dnd-kit/utilities";
import { DndItem } from "../../hooks/useDndItem";

export const snapHandleToCursor: Modifier = ({
	activatorEvent,
	draggingNodeRect,
	transform,
	active
}) =>
{
	if (draggingNodeRect && activatorEvent)
	{
		const activeItem: DndItem | undefined = active?.data.current as DndItem;
		const activatorCoordinates: Coordinates | null = getEventCoordinates(activatorEvent);

		if (!activatorCoordinates)
			return transform;

		const initX: number = activatorCoordinates.x - draggingNodeRect.left;
		const initY: number = activatorCoordinates.y - draggingNodeRect.top;

		const offsetX: number = activeItem?.item.type === "group" ? 24 : draggingNodeRect.height / 2;
		const offsetY: number = activeItem?.item.type === "group" ? 20 : draggingNodeRect.height / 2;

		return {
			...transform,
			x: transform.x + initX - offsetX,
			y: transform.y + initY - offsetY
		};
	}

	return transform;
};
