import Package from "@/package.json";

export const buyMeACoffeeLink: string = "https://buymeacoffee.com/xfox111";
export const bskyLink: string = "https://bsky.app/profile/xfox111.net";
export const websiteLink: string = "https://xfox111.net";
export const v3blogPost: string = "https://at.xfox111.net/tabs-aside-3-0";

const githubLink = (path: string = "."): string =>
	new URL(path, browser.runtime.getManifest().homepage_url).href;

export const githubLinks =
{
	repo: githubLink(),
	release: githubLink(`releases/tag/v${Package.version}`),
	license: githubLink("blob/main/LICENSE"),
	translationGuide: githubLink("wiki/Contribution-Guidelines#contributing-to-translations"),
	privacy: githubLink("blob/main/PRIVACY.md")
};

export const storeLink: string =
	import.meta.env.FIREFOX
		? "https://addons.mozilla.org/en-US/firefox/addon/ms-edge-tabs-aside/" :
		browser.runtime.getManifest().update_url?.startsWith("https://edge.microsoft.com/") ?
			"https://microsoftedge.microsoft.com/addons/detail/tabs-aside/kmnblllmalkiapkfknnlpobmjjdnlhnd" :
			"https://chromewebstore.google.com/detail/tabs-aside/mgmjbodjgijnebfgohlnjkegdpbdjgin";
