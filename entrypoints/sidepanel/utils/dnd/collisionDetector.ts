import { ClientRect, Collision, CollisionDescriptor, CollisionDetection } from "@dnd-kit/core";
import { DndItem } from "../../hooks/useDndItem";
import { centerOfRectangle, distanceBetween, getIntersectionRatio, getMaxIntersectionRatio, getRectSideCoordinates, sortCollisionsAsc } from "./dndUtils";

export function collisionDetector(vertical?: boolean): CollisionDetection
{
	return (args): Collision[] =>
	{
		const { collisionRect, droppableContainers, droppableRects, active, pointerCoordinates } = args;
		const activeItem = active.data.current as DndItem;

		if (!pointerCoordinates)
			return [];

		const collisions: CollisionDescriptor[] = [];
		const centerRect = centerOfRectangle(
			collisionRect,
			collisionRect.left,
			collisionRect.top
		);

		for (const droppableContainer of droppableContainers)
		{
			const { id, data } = droppableContainer;
			const rect = droppableRects.get(id);

			const droppableItem: DndItem = data.current as DndItem;

			if (!rect)
				continue;

			let value: number = 0;

			if (activeItem.item.type === "collection")
			{
				if (droppableItem.item.type !== "collection")
					continue;

				value = distanceBetween(centerOfRectangle(rect), centerRect);
				collisions.push({ id, data: { droppableContainer, value } });
				continue;
			}

			const intersectionRatio: number = getIntersectionRatio(rect, collisionRect);
			const intersectionCoefficient: number = intersectionRatio / getMaxIntersectionRatio(rect, collisionRect);

			if (droppableItem.item.type === "collection")
			{
				if (activeItem.indices.length === 2 && activeItem.indices[0] === droppableItem.indices[0])
					continue;

				if (intersectionCoefficient < 0.7 && activeItem.item.type === "tab")
					continue;

				if (activeItem.indices.length === 3 && activeItem.indices[0] === droppableItem.indices[0])
				{
					const [collectionId, groupId] = activeItem.indices;
					const groupRect: ClientRect | undefined = droppableRects.get(`${collectionId}/${groupId}`);

					if (!groupRect)
						continue;

					value = 1 / (intersectionRatio - getIntersectionRatio(groupRect, collisionRect));
				}
				else
				{
					value = 1 / intersectionRatio;
				}
			}
			else if (droppableItem.item.type === "group" && (id as string).endsWith("_dropzone"))
			{
				if (activeItem.item.type === "group")
					continue;

				if (
					activeItem.indices.length === 3 &&
					activeItem.indices[0] === droppableItem.indices[0] &&
					activeItem.indices[1] === droppableItem.indices[1]
				)
					continue;

				if (intersectionCoefficient < 0.5)
					continue;

				value = 1 / intersectionRatio;
			}
			else if (activeItem.indices.length === droppableItem.indices.length)
			{
				if (activeItem.indices[0] !== droppableItem.indices[0])
					continue;

				if (activeItem.indices.length === 3 && activeItem.indices[1] !== droppableItem.indices[1])
					continue;

				if (droppableItem.item.type === "group" && droppableItem.item.pinned === true)
					continue;

				if (activeItem.item.type === "tab" && droppableItem.item.type === "tab")
				{
					value = distanceBetween(centerOfRectangle(rect), centerRect);
				}
				else
				{
					const activeIndex: number = activeItem.indices[activeItem.indices.length - 1];
					const droppableIndex: number = droppableItem.indices[droppableItem.indices.length - 1];
					const before: boolean = activeIndex < droppableIndex;

					value = distanceBetween(
						getRectSideCoordinates(rect, before, vertical),
						getRectSideCoordinates(collisionRect, before, vertical)
					);
				}
			}

			if ((value > 0 && value < Number.POSITIVE_INFINITY) || active.id === id)
				collisions.push({ id, data: { droppableContainer, value } });
		};

		return collisions.sort(sortCollisionsAsc);
	};
}
