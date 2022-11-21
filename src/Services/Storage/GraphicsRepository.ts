import { IGraphics } from "../../Models/Data";
import { ext } from "../../Utils";

/**
 * Provides access to saved graphics (icons and thumbnails).
 */
export default class GraphicsRepository
{
	/**
	 * Gets saved graphics from storage.
	 * @returns Dictionary of IGraphics objects, where key is the URL of the graphics.
	 */
	public async GetGraphicsAsync(): Promise<Record<string, IGraphics>>
	{
		if (!ext)
			return { };

		let data: Record<string, any> = await ext.storage.local.get(null);
		let graphics: Record<string, IGraphics> = { };

		for (let key in data)
			try
			{
				new URL(key);
				graphics[key] = data[key] as IGraphics;
			}
			catch { continue; }

		return graphics;
	}

	/**
	 * Saves graphics to storage.
	 * @param graphics Dictionary of IGraphics objects, where key is the URL of the graphics.
	 */
	public async AddOrUpdateGraphicsAsync(graphics: Record<string, IGraphics>): Promise<void>
	{
		if (!ext)
			return;

		let data: Record<string, any> = await ext.storage.local.get(Object.keys(graphics));

		for (let key in graphics)
			if (data[key] === undefined)
				data[key] = graphics[key];
			else
				data[key] = { ...data[key], ...graphics[key] };

		await ext.storage.local.set(graphics);
	}

	/**
	 * Removes graphics from storage.
	 * @param graphics Dictionary of IGraphics objects, where key is the URL of the graphics.
	 */
	public async RemoveGraphicsAsync(graphics: Record<string, IGraphics>): Promise<void>
	{
		if (!ext)
			return;

		await ext.storage.local.remove(Object.keys(graphics));
	}
}
