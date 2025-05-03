import { ClientRect, CollisionDescriptor } from "@dnd-kit/core";
import { Coordinates } from "@dnd-kit/utilities";

export function getRectSideCoordinates(rect: ClientRect, before: boolean, vertical?: boolean)
{
	if (before)
		return vertical ? bottomsideOfRect(rect) : rightsideOfRect(rect);

	return vertical ? topsideOfRect(rect) : leftsideOfRect(rect);
}

export function getMaxIntersectionRatio(entry: ClientRect, target: ClientRect): number
{
	const entrySize = entry.width * entry.height;
	const targetSize = target.width * target.height;

	return Math.min(targetSize / entrySize, entrySize / targetSize);
}

function topsideOfRect(rect: ClientRect): Coordinates
{
	const { left, top } = rect;

	return {
		x: left + rect.width * 0.5,
		y: top
	};
}

function bottomsideOfRect(rect: ClientRect): Coordinates
{
	const { left, bottom } = rect;
	return {
		x: left + rect.width * 0.5,
		y: bottom
	};
}

function rightsideOfRect(rect: ClientRect): Coordinates
{
	const { right, top } = rect;
	return {
		x: right,
		y: top + rect.height * 0.5
	};
}

function leftsideOfRect(rect: ClientRect): Coordinates
{
	const { left, top } = rect;
	return {
		x: left,
		y: top + rect.height * 0.5
	};
}

/*
 * MIT License
 *
 * Copyright (c) 2021, Claudéric Demers
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export function distanceBetween(p1: Coordinates, p2: Coordinates)
{
	return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function sortCollisionsAsc(
	{ data: { value: a } }: CollisionDescriptor,
	{ data: { value: b } }: CollisionDescriptor
)
{
	return a - b;
}

export function getIntersectionRatio(entry: ClientRect, target: ClientRect): number
{
	const top = Math.max(target.top, entry.top);
	const left = Math.max(target.left, entry.left);
	const right = Math.min(target.left + target.width, entry.left + entry.width);
	const bottom = Math.min(target.top + target.height, entry.top + entry.height);
	const width = right - left;
	const height = bottom - top;

	if (left < right && top < bottom)
	{
		const targetArea = target.width * target.height;
		const entryArea = entry.width * entry.height;
		const intersectionArea = width * height;
		const intersectionRatio =
			intersectionArea / (targetArea + entryArea - intersectionArea);

		return Number(intersectionRatio.toFixed(4));
	}

	// Rectangles do not overlap, or overlap has an area of zero (edge/corner overlap)
	return 0;
}

export function centerOfRectangle(
	rect: ClientRect,
	left = rect.left,
	top = rect.top
): Coordinates
{
	return {
		x: left + rect.width * 0.5,
		y: top + rect.height * 0.5
	};
}
