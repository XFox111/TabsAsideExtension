import GraphicsModel from "./GraphicsModel";

export default class GraphicsCollectionModel
{
	public static readonly KEY: string = "thumbnails";

	[key: string]: GraphicsModel;
}
