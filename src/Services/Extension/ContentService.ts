import ext from "../../Utils/ext";
import { ThumbnailAcquiredMessage } from "../../Utils/CommsMessage";

// This content script is injected into each browser tab.
// It's purpose is to retrive an OpenGraph thumbnail URL from the metadata

const LOG_PREFIX : string = "TabsAsideExtension.ContentService";

/**
 * Initializes content script
 */
async function Init(): Promise<void>
{
	console.log(`[${LOG_PREFIX}.Init]`, "Initializing background service...");

	if (!ext)
	{
		console.warn(`[${LOG_PREFIX}.Init]`, "Extension API is not available. Exiting...");
		return;
	}

	let thumbnail: string;

	try
	{
		thumbnail = GetThumbnailFromMeta();
		console.log(`[${LOG_PREFIX}.Init(GetThumbnailFromMeta)]`, `Retrieved thumbnail from meta tags for URL: ${document.location.href}`);
		ext.runtime.sendMessage(new ThumbnailAcquiredMessage(document.location.href, thumbnail));
	}
	catch (ex)
	{
		console.error(`[${LOG_PREFIX}.Init(GetThumbnailFromMeta)]`, (ex as Error).message);
	}


	console.log(`[${LOG_PREFIX}.Init]`, "Content script service initialized.");
}

/**
 * Extracts page's thumbnail from meta tags
 * @returns URL of the captured thumbnail image
 * @throws {Error} If no thumbnail was able to retrieve
 */
function GetThumbnailFromMeta(): string
{
	// This method tries to sequentially retrieve thumbnails from all know meta tags.
	// It stops on the first thumbnail found.

	// The order of search is:
	// 1. <meta property="og:image" content="https://example.com/image.jpg">
	// 2. <meta name="twitter:image" content="https://example.com/image.jpg">
	// 3. <link rel="thumbnail" href="https://example.com/thumbnail.jpg">
	// 4. <link rel="image_src" href="https://example.com/image.jpg">

	let url: string = document.querySelector<HTMLMetaElement>("head meta[property='og:image']")?.content;

	if (url)
		return url;

	url = document.querySelector<HTMLMetaElement>("head meta[name='twitter:image']")?.content;

	if (url)
		return url;

	url = document.querySelector<HTMLLinkElement>("head link[rel=thumbnail]")?.href;

	if (url)
		return url;

	url = document.querySelector<HTMLLinkElement>("head link[relimage_src]")?.href;

	if (url)
		return url;
	else
		throw new Error("The page contains no known thumbnail metadata");
}

Init();
