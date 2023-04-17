import CollectionModel from "../../Models/Data/CollectionModel";
import SettingsModel from "../../Models/Data/SettingsModel";
import IGraphics from "../../Models/Data/IGraphics";

/**
 * Migration interface
 */
export default interface IMigration
{
	/**
	 * Recover collections from previous version.
	 */
	RecoverCollectionsAsync(): Promise<CollectionModel[]>;

	/**
	 * Recover settings from previous version.
	 */
	RecoverSettingsAsync(): Promise<SettingsModel>;

	/**
	 * Recover graphics from previous version.
	 */
	RecoverGraphicsAsync(): Promise<Record<string, IGraphics>>;
}
