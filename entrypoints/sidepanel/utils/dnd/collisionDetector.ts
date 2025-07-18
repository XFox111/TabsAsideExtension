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
				// If we drag a collection, we should ignore other items, like tabs or groups
				if (droppableItem.item.type !== "collection")
					continue;

				// Using distance between centers
				value = distanceBetween(centerOfRectangle(rect), centerRect);
				collisions.push({ id, data: { droppableContainer, value } });
				continue;
			}

			const intersectionRatio: number = getIntersectionRatio(rect, collisionRect);
			const intersectionCoefficient: number = intersectionRatio / getMaxIntersectionRatio(rect, collisionRect);

			// Dragging a tab or a group over a collection
			if (droppableItem.item.type === "collection")
			{
				// Ignoring collection, if the tab or the group is inside that collection
				if (activeItem.indices.length === 2 && activeItem.indices[0] === droppableItem.indices[0])
					continue;

				// Ignoring collection if we're dragging a tab or a group that doesn't belong to the collection,
				// but intersection ratio is less than 0.7
				if (intersectionCoefficient < 0.7)
					continue;

				// If we're dragging a tab, that's inside a group that belongs to the collection,
				// we substract the group's intersection from the collection's one
				if (activeItem.indices.length === 3 && activeItem.indices[0] === droppableItem.indices[0])
				{
					const [collectionId, groupId] = activeItem.indices;
					const groupRect: ClientRect | undefined = droppableRects.get(`${collectionId}/${groupId}`);

					if (!groupRect)
						continue;

					value = 1 / (intersectionRatio - getIntersectionRatio(groupRect, collisionRect));
				}
				// Otherwise, use intersection ratio
				// At this point we're dragging either:
				// - a group, that doesn't belong to the collection
				// - a tab, that either belongs to the collection's group, or has intersection coefficient >= .7
				else
				{
					value = 2 / intersectionRatio;
				}
			}
			// If we're dragging a tab or a group over another group's dropzone
			else if (droppableItem.item.type === "group" && (id as string).endsWith("_dropzone"))
			{
				// Ignore, if we're dragging a group
				if (activeItem.item.type === "group")
					continue;

				// Ignore, if we're dragging a tab, that's inside the group
				if (
					activeItem.indices.length === 3 &&
					activeItem.indices[0] === droppableItem.indices[0] &&
					activeItem.indices[1] === droppableItem.indices[1]
				)
					continue;

				// Ignore, if coefficient is less than .5
				// (at this point we're dragging a tab, that's outside of the group's dropzone)
				if (intersectionCoefficient < 0.5)
					continue;

				// Use intersection between the tab and the group's dropzone
				value = 1 / intersectionRatio;
			}
			// We're dragging a group or a tab over its sibling
			else if (activeItem.indices.length === droppableItem.indices.length)
			{
				if (activeItem.indices[0] !== droppableItem.indices[0])
					continue;

				if (activeItem.indices.length === 3 && activeItem.indices[1] !== droppableItem.indices[1])
					continue;

				// Ignore pinned groups
				if (droppableItem.item.type === "group" && droppableItem.item.pinned === true)
					continue;

				const collectionRect: ClientRect | undefined = droppableRects.get(activeItem.indices[0].toString());

				if (!collectionRect)
					continue;

				const collectionIntersectionRatio: number = getIntersectionRatio(collectionRect, collisionRect);
				const collectionIntersectionCoefficient: number = collectionIntersectionRatio / getMaxIntersectionRatio(collectionRect, collisionRect);

				// Ignore if we are outside of the home collection
				if (collectionIntersectionCoefficient < 0.7)
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
