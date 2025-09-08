import getLogger from "@/utils/getLogger";
import { sendMessage } from "@/utils/messaging";

// This content script is injected into each browser tab.
// It's purpose is to retrive an OpenGraph thumbnail URL from the metadata

export default defineUnlistedScript({ main });

const logger = getLogger("contentScript");

async function main(): Promise<void>
{
	logger("init");

	// This method tries to sequentially retrieve thumbnails from all know meta tags.
	// It stops on the first thumbnail found.

	// The order of search is:
	// 1. <meta property="og:image" content="https://example.com/image.jpg">
	// 2. <meta name="twitter:image" content="https://example.com/image.jpg">
	// 3. <link rel="thumbnail" href="https://example.com/thumbnail.jpg">
	// 4. <link rel="image_src" href="https://example.com/image.jpg">

	const thumbnailUrl: string | undefined =
		document.querySelector<HTMLMetaElement>("head meta[property='og:image']")?.content ??
		document.querySelector<HTMLMetaElement>("head meta[name='twitter:image']")?.content ??
		document.querySelector<HTMLLinkElement>("head link[rel=thumbnail]")?.href ??
		document.querySelector<HTMLLinkElement>("head link[rel=image_src]")?.href;

	if (thumbnailUrl)
	{
		logger(`Found thumbnail for "${document.location.href}"`, thumbnailUrl);
		await sendMessage("addThumbnail", {
			url: document.location.href,
			thumbnail: thumbnailUrl
		});
	}
	else
		logger(`No thumbnail found for "${document.location.href}"`);

	logger("done");
}
