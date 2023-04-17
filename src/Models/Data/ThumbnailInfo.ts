/**
 * Captured thumbnail info
 */
export default class ThumbnailInfo
{
	/**
	 * Thumbnail captured by WebExt API on a runtime. Base64-encoded JPEG image
	 */
	public LiveThumbnail?: string;
	/**
	 * Fallback thumnail retrieved from page's meta tags. URL of the image
	 */
	public MetaThumbnail?: string;
	/**
	 * UNIX timestamp that represents the time thumbnails have been retrieved
	 */
	public Timestamp: number;

	/**
	 * Creates an instance of the class
	 * @param metaThumbnail URL of a thumbnail, captured from metadata
	 * @param liveThumbnail Base64-encoded JPEG image of a page, captured by WebExt API
	 */
	constructor(metaThumbnail?: string, liveThumbnail?: string)
	{
		if (!metaThumbnail && !liveThumbnail)
			throw new ReferenceError("At least one of the thumbnails are required");

		this.Timestamp = Date.now();
		this.MetaThumbnail = metaThumbnail;
		this.LiveThumbnail = liveThumbnail;
	}
}
